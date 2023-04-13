import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  addProducts = async (product) => {
    try {
      const products = await this.getProducts();
      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;
      }

      let idProd = products.find((prod)=> prod.id === product.id);
      if (idProd){
        product.id+1
      }

      let codigo = products.find((prod) => prod.code === product.code);
      if (codigo) {
        return console.log("El code que ingreso ya existe, ingrese otro code");
      } else {
        products.push(product);

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );

        return product;
      }
    } catch (error) {
      console.log(error);
    }
  };


  deleteProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = products.findIndex((prod) => {
        return prod.id === id;
      });

      if (product !== -1) {
        products.splice(product, 1);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t"));
        
      } else {
        console.log("producto no encontrado");
      }
      return products;
    } catch (error) {
      console.log(error);
    }
  };


  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const obj = products.find((obj) => obj.id === id);

      if (obj) {
        console.log("El objeto encontrado es");
        return obj;
      }
      if (!obj) {
        console.log("el objeto no existe");
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (
    
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    id
  ) => {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);

      if (index === -1) {
        return "El producto que quiere modificar no existe";
      }

      const updatedProduct = {
        
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id,
      };

      const existingProduct = products.find((product) => product.code === code);
      if (existingProduct && existingProduct.id !== id) {
        return "El 'code' del producto ya existe, intente cambiarlo.";
      }

      products.splice(index, 1, updatedProduct);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      console.log("El producto se modificó con éxito");
      return updatedProduct;
    } catch (error) {
      console.error(error);
    }
  };

  deleteAllProducts = async () => {
    try {
      await fs.promises.writeFile(this.path, "[]");
    } catch (error) {
      console.log(error);
    }
  };
}
