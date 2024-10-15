import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.schema';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Get()
    async findAllCompanies(
        @Query('page') page: number = 0,
        @Query('limit') limit: number = 10
    ): Promise<{ companies: Company[], page: number }> {
        return this.companyService.findAllCompanies(page, limit);
    }

    @Get(':employerId')
    async findCompaniesByEmployer(
        @Param('employerId') employerId: string
    ): Promise<Company[]> {
        return this.companyService.findCompaniesByEmployer(employerId);
    }

    @Post()
    async createCompany(@Body() createCompanyDtoCreateCompanyDto: CreateCompanyDto): Promise<Company> {
        return this.companyService.createCompany(createCompanyDtoCreateCompanyDto);
    }

    @Patch(':id')
    async updateCompany(@Param('id') id: string, @Body() updateCompanyDtoUpdateCompanyDto: UpdateCompanyDto): Promise<Company> {
        return this.companyService.updateCompany(id, updateCompanyDtoUpdateCompanyDto);
    }

    @Delete(':id')
    async deleteCompany(@Param('id') id: string): Promise<Company> {
        return this.companyService.deleteCompany(id);
    }
}
