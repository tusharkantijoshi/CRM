import Contact from '../../db/models/Contact.js';

// @desc    Get all contacts (with search & filter)
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, status } = req.query;
        // Filter by created_by (user's contacts)
        let query = { created_by: req.user.id };

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
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (company) contactFields.company = company;
    if (status) contactFields.status = status;
    if (notes) contactFields.notes = notes;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns contact (checking created_by)
        if (contact.created_by.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: contactFields },
            { new: true }
        );

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

        res.json({ msg: 'Contact removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
