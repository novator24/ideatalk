import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  originalFileName: string;

  @Column('text')
  fileData: string; // base64 encoded file

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 0 })
  processedCount: number;

  @Column({ default: 0 })
  errorCount: number;

  @Column()
  contentType: string;

  @Column()
  uploadedBy: string;

  @ManyToOne(() => User)
  uploader: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
