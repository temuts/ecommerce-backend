const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category }, // Include associated Category data
        { model: Tag, through: ProductTag, as: 'tags' }, // Include associated Tag data via ProductTag
      ],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category }, 
        { model: Tag, through: ProductTag, as: 'tags' }, 
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// update product
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedProduct = await Product.update(req.body, {
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (req.body.tagIds && req.body.tagIds.length) {
//       const existingProductTags = await ProductTag.findAll({
//         where: { product_id: req.params.id },
//       });

//       const existingTagIds = existingProductTags.map(({ tag_id }) => tag_id);

//       const tagsToRemove = existingTagIds.filter(
//         (tag_id) => !req.body.tagIds.includes(tag_id)
//       );

//       const newTagsToAdd = req.body.tagIds.filter(
//         (tag_id) => !existingTagIds.includes(tag_id)
//       );

//       await ProductTag.destroy({ where: { tag_id: tagsToRemove } });

//       if (newTagsToAdd.length > 0) {
//         const productTagIdArr = newTagsToAdd.map((tag_id) => {
//           return {
//             product_id: req.params.id,
//             tag_id,
//           };
//         });
//         await ProductTag.bulkCreate(productTagIdArr);
//       }
//     }

//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json(err);
//   }
// });

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
