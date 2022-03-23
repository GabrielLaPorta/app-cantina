// ProductController.js
var express = require('express');
const Database = require("../../db/Database")
const pgp = require('pg-promise')();
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const columnSet = new pgp.helpers.ColumnSet(
    [
      {
        name: "name",
      },
      {
        name: "price",
      },
    ],
    { table: { table: "product" } }
);

function validate(name, price) {
    if (!name) return "O nome não pode ser vazio";
    if (!price) return "O preço não pode ser vazio";
    return true;
}

router.get('/', async (req, res) => {
    try {
        const products = await Database.getDB().query("SELECT * FROM product");
        return res.status(200).json({
            products
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const product = await Database.getDB().oneOrNone("SELECT * FROM product WHERE id = $1::uuid", [req.params.id]);
        return res.status(200).json({
            ...product
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const validation = validate(req.body.name, req.body.price);
        if (typeof validation === "string")
            return res.status(400).json({
            message: validation,
        });

       await Database.getDB().tx(async (t) => {
            return await t.query(
              pgp.helpers.insert(
                { name: req.body.name, price: req.body.price},
                columnSet
              )
            );
        });

        return res.status(200).json({
            message: "Produto inserido com sucesso!"
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const validation = validate(req.body.name, req.body.price);
        if (typeof validation === "string")
            return res.status(400).json({
            message: validation,
        });

        await Database.getDB().tx(async (t) => {
            return await t.query(
                pgp.helpers.update(
                    {
                        id: req.params.id,
                        name: req.body.name,
                        price: req.body.price,
                    },
                    columnSet
                ) + `WHERE id = '${req.params.id}'`
            );
        });

        return res.status(200).json({
            message: "Produto alterado com sucesso!"
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Database.getDB().result(
            "DELETE FROM product WHERE id = $1",
            [req.params.id],
            (r) => r.rowCount
          );

        return res.status(200).json({
            message: "Produto deletado com sucesso!"
        });
    } catch (error) {
        return res.status(500).json({
            error
        });
    }
});

module.exports = router;