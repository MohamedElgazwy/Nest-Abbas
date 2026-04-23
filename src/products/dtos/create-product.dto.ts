import { IsString, IsNumber, IsNotEmpty, Min, Length, IsOptional, MinLength} from 'class-validator'

export class CreateProductDto {
    @IsString({ message: 'this custom message'})
    @IsNotEmpty()
    
    @Length(2, 15)
    title: string;

    @IsString()
    @IsOptional()
    @MinLength(5)
    description: string;

    @IsNumber()
    @Min(0, {message: 'Price should not be less than zero'})
    @IsNotEmpty()
    price: number;
}