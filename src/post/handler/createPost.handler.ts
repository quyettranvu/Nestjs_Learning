import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { PostRepository } from '../repository/post.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private postRepository: PostRepository) {}

  //follow the same like using normally: command.createPostDtp = post
  async execute(command: CreatePostCommand): Promise<any> {
    command.createPostDto.user = command.user._id;
    return await this.postRepository.create(command.createPostDto);
  }
}
