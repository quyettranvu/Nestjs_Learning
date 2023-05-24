import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { MailerService } from '@nest-modules/mailer/dist';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
  ) {}

  async create(userDto: CreateUserDto) {
    userDto.password = await bcrypt.hash(userDto.password, 10);

    //check exists
    const userInDb = await this.userRepository.findByCondition({
      email: userDto.email,
    });

    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    await this.mailerService.sendMail({
      to: userDto.email,
      subject: 'Welcome to my website',
      template: './welcome', //name of file hbs in folder templates
      context: {
        name: userDto.name,
      },
    });

    return await this.userRepository.create(userDto);
  }

  async findByLogin({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findByCondition({
      email: email,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const is_equal = bcrypt.compare(password, user.password);

    if (!is_equal) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findByEmail(email) {
    return await this.userRepository.findByCondition({
      email: email,
    });
  }

  async update(filter, update) {
    if (update.refreshToken) {
      update.refreshToken = await bcrypt.hash(
        this.reverse(update.refreshToken),
        10,
      );
    }
    return await this.userRepository.findByContionAndUpdate(filter, update);
  }

  async getUserByRefresh(refresh_token, email) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    if (
      !refresh_token ||
      typeof refresh_token !== 'string' ||
      refresh_token.length === 0
    ) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = bcrypt.compare(
      this.reverse(refresh_token),
      user.refreshToken,
    );

    if (!is_equal) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private reverse(s) {
    return s.split('').reverse().join('');
  }
}
