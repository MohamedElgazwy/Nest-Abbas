import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min, MinLength } from "class-validator";

export class UpdateProductDto {

    @IsString()
    @IsNotEmpty()
    @Length(2, 15)
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    @MinLength(5)
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message: 'Price should not be less than zero'})
    @IsOptional()
    price?: number;
}