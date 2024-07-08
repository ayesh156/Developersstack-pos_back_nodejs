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
  customerSchema.findOne({'_id': req.params.id }).then((selectedObj) => {
    if (selectedObj != null) {
      return resp.status(200).json({ data: selectedObj });
    }
    return resp.status(404).json({ message: "Customer not found!" });
  });
};
const update = async (req, resp) => {
  const updateData = await customerSchema.findByIdAndUpdate(
    { '_id': req.params.id },
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
    const deleteData = await customerSchema.findByIdAndDelete(
        { '_id': req.params.id });
    
      if (deleteData) {
        return resp.status(200).json({ message: "deleted" });
      } else {
        return resp.status(500).json({ message: "Internal server error!" });
      }
};
const findAll = (req, resp) => {
    try {
        const {searchText, page=1, size=10} = req.query;

        const pageNumber = parseInt(page);
        const pageSize = parseInt(size);

        const query = {};
        if(searchText){
            query.$text = {$search:searchText}
        }

        const skip = (pageNumber-1) * pageSize;

        const data = customerSchema.find(query).limit(pageSize).skip(skip);
        return resp.status(200).json(data);
    } catch (error) {
        return resp.status(500).json({ message: "Internal server error!" });
    }
};

module.exports = {
  create,
  findById,
  update,
  deleteById,
  findAll
};
