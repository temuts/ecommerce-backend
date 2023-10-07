const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tags = await Tag.findAll({
      include: [{
        model: Product,
        through: ProductTag,
        as: 'products',
      },
    ],
    });
    res.json(tags);
  } catch (error){
    console.log(`Error: ${error}`);
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product,
        through: ProductTag,
        as: 'products',
      },
    ],
    });
    if(!tag){
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.json(tag);
  } catch (error){
    console.log(`Error: ${error}`);
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
  if (!updatedTag[0]) {
    res.status(404).json({ message: 'No tag found with that id!' });
    return;
  }
  res.json({ message: 'Tag updated!' });
} catch (error){
  console.log(`Error: ${error}`);
  res.status(500).json(error);
}
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
        },
      });
    if (!deletedTag) {
    res.status(404).json({ message: 'No tag found with that id!' });
    return;
      } res.json({ message: 'Tag deleted!' });
    } 
  catch (error){
  console.log(`Error: ${error}`);
  res.status(500).json(error);
    }
});

module.exports = router;
