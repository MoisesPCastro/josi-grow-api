import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { FirestoreModule } from 'src/fireBase/firestore.module';

@Module({
  imports: [
    FirestoreModule,
  ],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule { }
