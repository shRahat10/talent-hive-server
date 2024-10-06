import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './company.schema';
import { Model } from 'mongoose';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>,
    ) { }

    async findAllCompanies(page: number, limit: number): Promise<{ companies: Company[], page: number }> {
        const skip = page * limit;

        const companies = await this.companyModel
            .find()
            .populate('employerId', '-__v')
            .sort({ updatedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!companies) {
            throw new Error("Companies not found");
        }

        return {
            companies: companies,
            page: +page + 1
        };
    }

    async findCompaniesByEmployer(employerId: string, page: number, limit: number): Promise<{ companies: Company[], page: number }> {
        const skip = page * limit;

        const companies = await this.companyModel
            .find({ employerId })
            .populate('employerId', '-__v')
            .sort({ updatedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        if (!companies) {
            throw new Error("Companies not found");
        }

        return {
            companies: companies,
            page: +page + 1
        };
    }

    async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
        const newCompany = new this.companyModel(createCompanyDto);
        return newCompany.save();
    }

    async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(
            id,
            { $set: updateCompanyDto },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedCompany) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        return updatedCompany;
    }

    async deleteCompany(id: string): Promise<Company> {
        const deletedCompany = await this.companyModel.findByIdAndDelete(id).exec();

        if (!deletedCompany) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        return deletedCompany;
    }
}
