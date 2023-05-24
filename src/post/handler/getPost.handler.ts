import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostQuery } from '../queries/getPost.query';
import { PostRepository } from '../repository/post.repository';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(private postRepository: PostRepository) {}

  async execute(command: GetPostQuery): Promise<any> {
    return await this.postRepository.findById(command.post_id);
  }
}
