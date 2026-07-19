import Bill from '../models/billModel.js';

export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBill = async (req, res) => {
  try {
    const bill = await Bill.create({ user: req.user.id, ...req.body });
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: 'Bill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
