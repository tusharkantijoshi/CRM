import Contact from '../../db/models/Contact.js';
import ActivityLog from '../../db/models/ActivityLog.js';

// @desc    Get all contacts (with search & filter)
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, status } = req.query;
        // All users can see all contacts
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            const statuses = status.split(',');
            if (statuses.length > 0) {
                query.status = { $in: statuses };
            }
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Contact.countDocuments(query);

        res.json({
            contacts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add new contact
// @route   POST /api/contacts
// @access  Private
export const createContact = async (req, res) => {
    const { name, email, phone, company, status, notes } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            company,
            status,
            notes,
            created_by: req.user.id,
            modified_by: req.user.id
        });

        const contact = await newContact.save();

        // Log activity
        await ActivityLog.create({
            action: 'create',
            entity: 'Contact',
            entity_id: contact._id,
            details: { name: contact.name, email: contact.email },
            created_by: req.user.id
        });

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
export const updateContact = async (req, res) => {
    const { name, email, phone, company, status, notes } = req.body;

    // Build contact object & update modified_by
    const contactFields = {
        modified_by: req.user.id
    };
    if (name !== undefined) contactFields.name = name;
    if (email !== undefined) contactFields.email = email;
    if (phone !== undefined) contactFields.phone = phone;
    if (company !== undefined) contactFields.company = company;
    if (status !== undefined) contactFields.status = status;
    if (notes !== undefined) contactFields.notes = notes;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns contact (checking created_by)
        if (contact.created_by.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Store original contact for activity logging comparison
        const originalContact = { ...contact.toObject() };

        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: contactFields },
            { new: true, runValidators: true }
        );

        // Track what changed for activity log
        const changedFields = {};
        const fieldsToCheck = ['name', 'email', 'phone', 'company', 'status', 'notes'];

        for (const field of fieldsToCheck) {
            // Check if the field was provided in the request body and if its value has actually changed
            if (contactFields[field] !== undefined && originalContact[field] !== contactFields[field]) {
                changedFields[field] = {
                    from: originalContact[field],
                    to: contactFields[field]
                };
            }
        }

        // Log activity only if something changed
        if (Object.keys(changedFields).length > 0) {
            await ActivityLog.create({
                action: 'update',
                entity: 'Contact',
                entity_id: contact._id,
                details: changedFields,
                created_by: req.user.id
            });
        }

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns contact
        if (contact.created_by.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Contact.findByIdAndDelete(req.params.id);

        // Log activity
        await ActivityLog.create({
            action: 'delete',
            entity: 'Contact',
            entity_id: req.params.id,
            details: { name: contact.name }, // Log name for reference
            created_by: req.user.id
        });

        res.json({ msg: 'Contact removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get contact activity
// @route   GET /api/contacts/:id/activity
// @access  Private
export const getContactActivity = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns contact
        if (contact.created_by.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const activities = await ActivityLog.find({
            entity_id: req.params.id,
            entity: 'Contact'
        }).sort({ created_at: -1 });

        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
