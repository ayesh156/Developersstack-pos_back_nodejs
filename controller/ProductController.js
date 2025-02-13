const productSchema = require("../model/ProductSchema");

const create = (req, resp) => {
  const product = new productSchema({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    unitPrice: req.body.unitPrice,
    qtyOnHand: req.body.qtyOnHand
  });
  product
    .save()
    .then((response) => {
      resp.status(201).json({ message: "Product saved!" });
    })
    .catch((error) => {
      return resp.status(500).json(error);
    });
};
const findById = (req, resp) => {
  productSchema.findOne({ '_id': req.params.id }).then((selectedObj) => {
    if (selectedObj != null) {
      return resp.status(200).json( selectedObj );
    }
    return resp.status(404).json({ message: "Product not found!" });
  });
};

const update = async (req, resp) => {
  const updateData = await productSchema.findByIdAndUpdate(
    { '_id': req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        unitPrice: req.body.unitPrice,
        qtyOnHand: req.body.qtyOnHand
      },
    },{new:true});

    if(updateData){
        return resp.status(200).json({ message: "updated" });
    } else{
        return resp.status(500).json({ message: "Internal server error!" });
    }
};

const deleteById = async (req, resp) => {
    const deleteData = await productSchema.findByIdAndDelete(
        { '_id': req.params.id });
    
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

    await productSchema.find(query)
      .limit(pageSize)
      .skip(skip).then(data=>{
        return resp.status(200).json(data);
      });

  } catch (error) {
    console.error(error);
    return resp.status(500).json({ message: "Internal server error" });
  }
};

const findAllMin =  (req, resp) => {
  try{
    productSchema.find({qtyOnHand:{$lt:10}}).then(data=>{
        return resp.status(200).json(data);
    })

}catch (error){
    return resp.status(500).json({'message':'internal server error'});
}
  
};

const findCount =  (req, resp) => {
  try {

    productSchema.countDocuments().then(data=>{
        return resp.status(200).json(data);
      });

  } catch (error) {
    return resp.status(500).json({ message: "Internal server error" });
  }
  
};

module.exports = {
  create,
  findById,
  update,
  deleteById,
  findAll,
  findAllMin,
  findCount
};
