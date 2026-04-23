import { Body, Controller, Get, Param, Post, NotFoundException, Put, Delete, Req, Res, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
    
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @Post()
    public createNewProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }
    
    @Get()
    public getAllProducts() {
        
        return this.productsService.getAll();
    }

    @Get(':id')
    public getOneProduct(@Param("id", ParseIntPipe) id: number) {
        return this.productsService.getOneBy(id);
    }

    @Put(':id')
    public updateProduct(@Param('id') id: number, @Body() body: UpdateProductDto) {
        this.productsService.update(id, body);
    }

     @Delete(':id')
    public deleteProduct(@Param('id') id: number) {
        this.productsService.delete(id);
    }
}