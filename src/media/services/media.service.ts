/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { MediaRepository } from '../repository/media.repository';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ObjectId } from 'mongodb';

@Injectable()
export class MediaService {
  private readonly region;
  private readonly accessKeyId;
  private readonly secretAccessKey;
  private readonly publicBucketName;

  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly configService: ConfigService,
  ) {
    this.region = this.configService.get('AWS_REGION');
    this.accessKeyId = this.configService.get('AWS_ACCESS_KEY');
    this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    this.publicBucketName = this.configService.get('AWS_PUBLIC_BUCKET_NAME');
  }

  //Get method
  getLinkMediaKey(media_key) {
    const s3 = this.getS3();
    return s3.getSignedUrl('getObject', {
      Key: media_key,
      Bucket: this.publicBucketName,
      Expires: 60 * 60 * 12,
    });
  }

  //Update ACL(Access Control List)
  async updateACL(media_id) {
    const media = await this.mediaRepository.findById(media_id);
    const s3 = this.getS3();
    s3.putObjectAcl(
      {
        Bucket: this.publicBucketName,
        Key: media.key, //getvalue key from returned model
        ACL: 'public-read',
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      (err, data) => {},
    );

    return (
      s3.endpoint.protocol +
      '//' +
      this.publicBucketName +
      '.' +
      s3.endpoint.hostname +
      '/' +
      media.key
    );
  }

  async upload(file) {
    const objectId = new ObjectId();
    const arr_name = file.originalname.split('.');
    const extension = arr_name.pop();
    const name = arr_name.join('.');
    const key = objectId + '/' + this.slug(name) + '.' + extension;
    const data = {
      _id: objectId,
      name: name,
      file_name: String(file.originalname),
      mime_type: file.mimetype,
      size: file.size,
      key: key,
    };

    // console.log(file);
    await this.uploadS3(file.buffer, key, file.mimetype);
    return this.mediaRepository.create(data);
  }

  async deleteFileS3(media_id) {
    const media = await this.mediaRepository.findById(media_id);
    const s3 = this.getS3();
    const params = {
      Bucket: this.publicBucketName,
      Key: media.key,
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    s3.deleteObject(params, (err, data) => {});
    await media.deleteOne();
    return true;
  }

  private async uploadS3(file_buffer, key, content_type) {
    const s3 = this.getS3();
    const params = {
      Bucket: this.publicBucketName,
      Key: key,
      Body: file_buffer,
      ContentType: content_type,
      //   ACL: 'public-read', //comment if private file
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  private getS3() {
    return new S3({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }

  private slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to =
      'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }
}
