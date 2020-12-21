import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from '../countries/countries.module';
import { UsersModule } from '../users/users.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News, NewsSchema } from './schema/news.schema';

@Module({
  providers: [NewsService],
  controllers: [NewsController],
  imports: [MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]), CountriesModule]
})
export class NewsModule {}
