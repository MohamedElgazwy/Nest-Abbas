import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JWTPayloadType} from '../utils/types'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
    constructor(
       @InjectRepository(User ) private readonly usersRepository: Repository<User>,
       private readonly jwtService: JwtService,
       private readonly config: ConfigService,
    ){}
   
    /**
     * Create new user
     * @param registerDto data for creating new user
     * @returns JWT (access token)
     */
    public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
        const { email, password, username } = registerDto;
        const userFromDb = await this.usersRepository.findOne({ where: { email }});
        if( userFromDb ) throw new BadRequestException("User is already exists.");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = this.usersRepository.create({
            email,
            username,
            password: hashedPassword,
        });

        newUser = await this.usersRepository.save(newUser);

        const accessToken = await this.generateJWT({ id: newUser.id, userType: newUser.userType });

        return {accessToken};
    }

    /**
     * Log In user
     * @param loginDto data for log in to user account
     * @returns JWT (access token)
     */
    public async login (loginDto: LoginDto): Promise<AccessTokenType> {
        const { email, password } = loginDto;

        const user = await this.usersRepository.findOne({ where: { email }});
        if(!user) throw new BadRequestException('Invalid email or password.');
        

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) throw new BadRequestException('Invalid email or password.');

        const accessToken = await this.generateJWT({ id: user.id, userType: user.userType });
        return { accessToken };
    }

    /**
     * Get Current user (logged in user)
     * @param id id of the user logged
     * @returns 
     */
    public async getCurrentUser(bearerToken: string) {
        const [type, token] = bearerToken.split(' ');
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.config.get<string>('JWT_SECRET')
        });
        const user = await this.usersRepository.findOne({where: { id: payload.id }});
        if(!user) throw new NotFoundException('User not found.');
        console.log(payload);
        return user;
    }

    /**
     * Generate Json Web Token
     * @param payload JWT payload
     * @returns token
     */
    private generateJWT(payload: JWTPayloadType) : Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
