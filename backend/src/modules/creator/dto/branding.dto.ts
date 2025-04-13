import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsIn,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WatermarkDto {
  @ApiProperty({ description: '水印图片（Base64或URL）' })
  @IsString()
  image: string;

  @ApiProperty({
    description: '水印位置',
    enum: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
    default: 'bottomRight',
  })
  @IsString()
  @IsIn(['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'])
  position: string;

  @ApiProperty({ description: '水印透明度（0-100）', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  opacity: number;

  @ApiProperty({ description: '水印大小（占视频宽度的百分比）', minimum: 5, maximum: 30 })
  @IsNumber()
  @Min(5)
  @Max(30)
  size: number;
}

export class IntroDto {
  @ApiProperty({ description: '片头视频（Base64或URL）' })
  @IsString()
  video: string;

  @ApiProperty({ description: '是否自动添加到所有新视频', default: true })
  @IsBoolean()
  autoAdd: boolean;

  @ApiProperty({
    description: '过渡效果',
    enum: ['fade', 'slide', 'zoom', 'none'],
    default: 'fade',
  })
  @IsString()
  @IsIn(['fade', 'slide', 'zoom', 'none'])
  transition: string;
}

export class OutroDto {
  @ApiProperty({ description: '片尾视频（Base64或URL）' })
  @IsString()
  video: string;

  @ApiProperty({ description: '是否自动添加到所有新视频', default: true })
  @IsBoolean()
  autoAdd: boolean;

  @ApiProperty({
    description: '过渡效果',
    enum: ['fade', 'slide', 'zoom', 'none'],
    default: 'fade',
  })
  @IsString()
  @IsIn(['fade', 'slide', 'zoom', 'none'])
  transition: string;

  @ApiProperty({ description: '是否添加订阅按钮', default: true })
  @IsBoolean()
  addSubscribeButton: boolean;
}

export class ThemeDto {
  @ApiProperty({ description: '主题颜色（十六进制，不含#）', example: '58a6ff' })
  @IsString()
  color: string;
}

export class BrandingSettingsDto {
  @ApiPropertyOptional({ type: WatermarkDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WatermarkDto)
  watermark?: WatermarkDto;

  @ApiPropertyOptional({ type: IntroDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => IntroDto)
  intro?: IntroDto;

  @ApiPropertyOptional({ type: OutroDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OutroDto)
  outro?: OutroDto;

  @ApiPropertyOptional({ type: ThemeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeDto)
  theme?: ThemeDto;
}

export class BrandingSettingsResponseDto {
  @ApiProperty({ type: () => WatermarkResponseDto })
  watermark: WatermarkResponseDto;

  @ApiProperty({ type: () => IntroResponseDto })
  intro: IntroResponseDto;

  @ApiProperty({ type: () => OutroResponseDto })
  outro: OutroResponseDto;

  @ApiProperty({ type: () => ThemeDto })
  theme: ThemeDto;

  @ApiProperty({
    description: '最后更新时间',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsString()
  updatedAt: string;
}

export class WatermarkResponseDto {
  @ApiProperty({ description: '水印图片URL' })
  @IsString()
  url: string;

  @ApiProperty({
    description: '水印位置',
    enum: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
  })
  @IsString()
  position: string;

  @ApiProperty({ description: '水印透明度（0-100）' })
  @IsNumber()
  opacity: number;

  @ApiProperty({ description: '水印大小（占视频宽度的百分比）' })
  @IsNumber()
  size: number;
}

export class IntroResponseDto {
  @ApiProperty({ description: '片头视频URL' })
  @IsString()
  url: string;

  @ApiProperty({ description: '是否自动添加到所有新视频' })
  @IsBoolean()
  autoAdd: boolean;

  @ApiProperty({
    description: '过渡效果',
    enum: ['fade', 'slide', 'zoom', 'none'],
  })
  @IsString()
  transition: string;
}

export class OutroResponseDto {
  @ApiProperty({ description: '片尾视频URL' })
  @IsString()
  url: string;

  @ApiProperty({ description: '是否自动添加到所有新视频' })
  @IsBoolean()
  autoAdd: boolean;

  @ApiProperty({
    description: '过渡效果',
    enum: ['fade', 'slide', 'zoom', 'none'],
  })
  @IsString()
  transition: string;

  @ApiProperty({ description: '是否添加订阅按钮' })
  @IsBoolean()
  addSubscribeButton: boolean;
}
