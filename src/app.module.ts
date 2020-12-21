import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './modules/countries/countries.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsModule } from './modules/locations/locations.module';
import { ProblemsModule } from './modules/problems/problems.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PreferenceModule } from './modules/preferences/preference.module';
import { ProblemsAuditModule } from './modules/problemsAudit/problemsAudit.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NewsModule } from './modules/news/news.module';
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

let root;
if (process.env.NODE_ENV === 'local') {
  root = 'mongodb://localhost:27017/ctp';
} else {
  root = `mongodb+srv://${username}:${password}@cluster0.bgcfb.mongodb.net/countries?retryWrites=true&w=majority`;
}
@Module({
  imports: [
    CountriesModule,
    LocationsModule,
    ProblemsModule,
    UsersModule,
    AuthModule,
    PreferenceModule,
    ProblemsAuditModule,
    CommentsModule,
    NewsModule,
    MongooseModule.forRoot(root)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
