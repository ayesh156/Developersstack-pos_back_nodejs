const customerSchema = require("../model/CustomerSchema");

const create = (req, resp) => {
  const customer = new customerSchema({
    fullName: req.body.fullName,
    address: req.body.address,
    salary: req.body.salary,
  });
  customer
    .save()
    .then((response) => {
      resp.status(201).json({ message: "Customer saved!" });
    })
    .catch((error) => {
      return resp.status(500).json(error);
    });
};

const findById = (req, resp) => {
  customerSchema.findOne({ _id: req.params.id }).then((selectedObj) => {
    if (selectedObj != null) {
      return resp.status(200).json(selectedObj);
    }
    return resp.status(404).json({ message: "Customer not found!" });
  });
};

const update = async (req, resp) => {
  const updateData = await customerSchema.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        fullName: req.body.fullName,
        address: req.body.address,
        salary: req.body.salary,
      },
    },
    { new: true }
  );

  if (updateData) {
    return resp.status(200).json({ message: "updated" });
  } else {
    return resp.status(500).json({ message: "Internal server error!" });
  }
};
const deleteById = async (req, resp) => {
  const deleteData = await customerSchema.findByIdAndDelete({
    _id: req.params.id,
  });

  if (deleteData) {
    return resp.status(200).json({ message: "deleted" });
  } else {
    return resp.status(500).json({ message: "Internal server error!" });
  }
};
const findAll = async (req, resp) => {
  try {
    const { searchText, page = 1, size = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    const query = {};
    if (searchText) {
      query.fullName = { $regex: searchText, $options: 'i' }; // Case-insensitive search
    }

    const skip = (pageNumber - 1) * pageSize;

    const customers = await customerSchema.find(query)
      .limit(pageSize)
      .skip(skip);

    return resp.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return resp.status(500).json({ message: "Internal server error" });
  }
};

const findByName = async (req, res) => {
  try {
      const { name } = req.query;
      const customers = await customerSchema.find({ fullName: new RegExp(name, 'i') }); // Using a regex for case-insensitive matching
      res.status(200).json(customers);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  findById,
  update,
  deleteById,
  findAll,
  findByName
};
