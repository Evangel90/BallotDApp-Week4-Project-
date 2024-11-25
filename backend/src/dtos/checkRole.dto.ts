import { ApiProperty } from "@nestjs/swagger";

export class CheckRoleDto {
  @ApiProperty({ type: String, required: true, default: "Any Address" })
  address: string;
}