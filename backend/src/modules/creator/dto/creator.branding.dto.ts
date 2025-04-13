/**
 * 创作者品牌设置DTO
 */
import { IsString, IsNumber, IsBoolean, IsOptional, IsIn, Min, Max } from 'class-validator';

export class WatermarkDto {
  @IsString()
  image: string;

  @IsString()
  @IsIn(['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'])
  position: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  opacity: number;

  @IsNumber()
  @Min(5)
  @Max(30)
  size: number;
}

export class IntroDto {
  @IsString()
  video: string;

  @IsBoolean()
  autoAdd: boolean;

  @IsString()
  @IsIn(['fade', 'slide', 'zoom', 'none'])
  transition: string;
}

export class OutroDto {
  @IsString()
  video: string;

  @IsBoolean()
  autoAdd: boolean;

  @IsString()
  @IsIn(['fade', 'slide', 'zoom', 'none'])
  transition: string;

  @IsBoolean()
  addSubscribeButton: boolean;
}

export class ThemeDto {
  @IsString()
  color: string;
}

export class BrandingSettingsDto {
  @IsOptional()
  watermark?: WatermarkDto;

  @IsOptional()
  intro?: IntroDto;

  @IsOptional()
  outro?: OutroDto;

  @IsOptional()
  theme?: ThemeDto;
}
