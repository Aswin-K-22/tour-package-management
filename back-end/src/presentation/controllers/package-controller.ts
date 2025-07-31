import { Request, Response } from 'express';
import { IResponseDTO } from '@/domain/dtos/response.dto';
import { HttpStatus } from '@/domain/enums/httpStatus.enum';

import { S3Service } from '@/infrastructure/services/S3Service';
import { v4 as uuidv4 } from 'uuid';
import { CreatePackageUseCase } from '@/application/usecases/packages/CreatePackageUseCase';
import { GetAllPackagesUseCase } from '@/application/usecases/packages/GetAllPackagesUseCase';
import { UpdatePackageUseCase } from '@/application/usecases/packages/UpdatePackageUseCase';
import { DeletePackageUseCase } from '@/application/usecases/packages/DeletePackageUseCase';

export class PackageController {
  private s3Service: S3Service;

  constructor(
    private createPackageUseCase: CreatePackageUseCase,
    private getAllPackagesUseCase: GetAllPackagesUseCase,
    private updatePackageUseCase: UpdatePackageUseCase,
    private deletePackageUseCase: DeletePackageUseCase,
  ) {
    this.s3Service = new S3Service(); // Initialize S3 service
  }

  private sendResponse<T>(res: Response, result: IResponseDTO<T>): void {
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      ...(result.success && result.data ? { data: result.data } : {}),
    });
  }

async create(req: Request, res: Response) {
    // Step 1: Log incoming request data for debugging
    console.log('Incoming Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Incoming Files:', req.files ? (req.files as Express.Multer.File[]).map(f => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    })) : 'No files uploaded');

    try {
      const {
        title,
        description,
        sourceCountryId,
        sourceCityId,
        destinationCountryId,
        destinationCityId,
        termsAndConditions // Match frontend field name
      } = req.body;

      // Step 2: Parse and clean termsAndConditions
      let terms: string[] = [];
      try {
        // Handle termsAndConditions as array or single value
        terms = Array.isArray(termsAndConditions)
          ? termsAndConditions
          : typeof termsAndConditions === 'string'
            ? JSON.parse(termsAndConditions)
            : [termsAndConditions];

        // Filter out undefined, null, or empty strings
        terms = terms
          .filter((term) => term !== undefined && term !== null && typeof term === 'string' && term.trim() !== '')
          .map((term) => term.trim());

        console.log('Processed termsAndConditions:', terms);

        // Basic check for terms
        if (terms.length === 0) {
          console.error('No valid terms provided');
          return this.sendResponse(res, {
            status: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'At least one valid term is required',
          });
        }
      } catch (error) {
        console.error('Error parsing termsAndConditions:', error);
        return this.sendResponse(res, {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid termsAndConditions format',
        });
      }

      // Step 3: Handle file uploads
      const files = (req.files as Express.Multer.File[]) || [];
      console.log('Files to Process:', files.map(f => f.originalname));

      const uploadedKeys: string[] = [];
      for (const file of files) {
        const uniqueKey = `packages/${uuidv4()}-${file.originalname}`;
        console.log(`Generating S3 key: ${uniqueKey} for file: ${file.originalname}`);
        try {
          await this.s3Service.uploadFile(file, uniqueKey);
          uploadedKeys.push(uniqueKey);
          console.log(`Successfully uploaded file: ${file.originalname} to S3 with key: ${uniqueKey}`);
        } catch (uploadError) {
          console.error(`Failed to upload file: ${file.originalname}`, uploadError);
          return this.sendResponse(res, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: `Failed to upload file: ${file.originalname}`,
          });
        }
      }
      console.log('All Uploaded File Keys:', uploadedKeys);

      // Step 4: Execute package creation
      const result = await this.createPackageUseCase.execute({
        title,
        description,
        terms, // Use cleaned terms array
        source: {
          country: sourceCountryId,
          city: sourceCityId,
        },
        destination: {
          country: destinationCountryId,
          city: destinationCityId,
        },
        imageKeys: uploadedKeys,
      });

      console.log('Package Creation Result:', result);

      // Step 5: Send success response
      this.sendResponse(res, {
        status: HttpStatus.OK,
        success: true,
        data: result,
      });
    } catch (error : any) {
      console.error('Error in PackageController.create:', error);
      return this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error?.message || 'Internal server error',
      });
    }
  }


async update(req: Request, res: Response) {
  console.log('Incoming Update Request:', req.body, req.params);
  const packageId = req.params.id;

  try {
    const {
      title,
      description,
      sourceCountryId,
      sourceCityId,
      destinationCountryId,
      destinationCityId,
      termsAndConditions,
      deleteImageKeys,
    } = req.body;

    // Parse terms
    let terms: string[] = [];
    try {
      terms = Array.isArray(termsAndConditions)
        ? termsAndConditions
        : typeof termsAndConditions === 'string'
          ? JSON.parse(termsAndConditions)
          : [termsAndConditions];
      terms = terms.filter(term => typeof term === 'string' && term.trim()).map(term => term.trim());
    } catch (err) {
      return this.sendResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Invalid termsAndConditions format',
      });
    }

    // Parse deleted image keys (if any)
    let deletedKeys: string[] = [];
    if (deleteImageKeys) {
      try {
        deletedKeys = Array.isArray(deleteImageKeys)
          ? deleteImageKeys
          : typeof deleteImageKeys === 'string'
            ? JSON.parse(deleteImageKeys)
            : [deleteImageKeys];
      } catch (err) {
        return this.sendResponse(res, {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid deleteImageKeys format',
        });
      }
    }

    // Handle uploads
    const files = (req.files as Express.Multer.File[]) || [];
    const uploadedKeys: string[] = [];
    for (const file of files) {
      const key = `packages/${uuidv4()}-${file.originalname}`;
      await this.s3Service.uploadFile(file, key);
      uploadedKeys.push(key);
    }

    // Call use case
    const result = await this.updatePackageUseCase.execute({
      packageId,
      title,
      description,
      terms,
      source: {
        country: sourceCountryId,
        city: sourceCityId,
      },
      destination: {
        country: destinationCountryId,
        city: destinationCityId,
      },
      imageKeys: uploadedKeys,
      deleteImageKeys: deletedKeys,
    });

    return this.sendResponse(res, result);
  } catch (error: any) {
    console.error('Error in update:', error);
    return this.sendResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error?.message || 'Internal server error',
    });
  }
}



  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.getAllPackagesUseCase.execute({ page, limit });
      this.sendResponse(res, result);
    } catch (error) {
      console.error('Error in PackageController.getAll:', error);
      this.sendResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Internal server error',
      });
    }
  }

async delete(req: Request, res: Response) {
  const packageId = req.params.id;

  try {
    const result = await this.deletePackageUseCase.execute(packageId);
    return this.sendResponse(res, result);
  } catch (error: any) {
    console.error('Error deleting package:', error);
    return this.sendResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error?.message || 'Internal server error',
    });
  }
}

}
