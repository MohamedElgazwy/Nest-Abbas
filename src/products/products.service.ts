import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";
import { CreateProductDto } from "./dtos/create-product.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly ProductsRepository: Repository<Product>
    ) {}

    // create new product
    public async createProduct(dto: CreateProductDto) {
      const newProduct = this.ProductsRepository.create(dto);
      return await this.ProductsRepository.save(newProduct);
    }
    
    // get all products
    public getAll() {
        return this.ProductsRepository.find();
        
    }

    // Get one product by ID
    public async getOneBy(id: number) {
         const product = await this.ProductsRepository.findOne({ where: { id }});
         if(!product) throw new NotFoundException("This product not found");
        return product;
    }

    //Update Product
    public async update(id:number, dto: UpdateProductDto) {
        const product = await this.getOneBy(id);
        product.title = dto.title ?? product.title;
        product.description = dto.description ?? product.description;
        product.price = dto.price ?? product.price;

        return this.ProductsRepository.save(product);

    }

    // Delete Product
    public async delete(id: number) {
        const product = await this.getOneBy(id);
       await this.ProductsRepository.remove(product);
        return { message: 'Product deleted Successfully'}; 
    }

}