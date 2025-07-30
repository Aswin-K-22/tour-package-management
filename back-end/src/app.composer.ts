//back-end\\src\\app.composer.ts'
import { CreateUserUseCase } from "./application/usecases/auth/createUserUseCase";
import { GetUserUseCase } from "./application/usecases/auth/getUserUseCase";
import { LoginUserUseCase } from "./application/usecases/auth/loginUserUseCase";
import { CreateCountryUseCase } from "./application/usecases/country/CreateCountryUseCase";
import { DeleteCountryUseCase } from "./application/usecases/country/DeleteCountryUseCase";
import { GetAllCountriesUseCase } from "./application/usecases/country/GetAllCountriesUseCase";
import { UpdateCountryUseCase } from "./application/usecases/country/UpdateCountryUseCase";
import prisma from "./infrastructure/database/prisma-client";
import { AdminRepository } from "./infrastructure/repositories/admin-repository";
import { BannerRepository } from "./infrastructure/repositories/banner-repository";
import { CityRepository } from "./infrastructure/repositories/city-repository";
import { CountryRepository } from "./infrastructure/repositories/country-repository";
import { EnquiryRepository } from "./infrastructure/repositories/enquiry-repository";
import { PackageRepository } from "./infrastructure/repositories/package-repository";
import { ScheduleRepository } from "./infrastructure/repositories/schedule-repository";
import { BcryptPasswordHasher } from "./infrastructure/services/BcryptService";
import { JwtTokenService } from "./infrastructure/services/JwtTokenService";
import { AuthController } from "./presentation/controllers/auth-controller";
import { CountryController } from "./presentation/controllers/country-controller";
import { AuthMiddleware } from "./presentation/middlewares/authMiddleware";
import { AuthRoutes } from "./presentation/routes/auth-router";
import { CountryRoutes } from "./presentation/routes/country-routes";



export function composeApp() {
  // Repositories
    const countryRepository = new CountryRepository(prisma);
    const  adminRepository = new AdminRepository(prisma);
   const cityRepository = new CityRepository(prisma);
 const packageRepository = new PackageRepository(prisma);
const scheduleRepository = new ScheduleRepository(prisma);
const enquiryRepository = new EnquiryRepository(prisma);
const bannerRepository = new BannerRepository(prisma);

  // services
   const  tokenService = new JwtTokenService();
   const passwordHasher = new BcryptPasswordHasher();


//usecase
const createCountryUseCase = new CreateCountryUseCase(countryRepository);
const getAllCountriesUseCase = new GetAllCountriesUseCase(countryRepository);
const updateCountryUseCase = new UpdateCountryUseCase(countryRepository);
const deleteCountryUseCase = new DeleteCountryUseCase(countryRepository);


const createUserUseCase = new CreateUserUseCase(adminRepository,passwordHasher);
const loginUserUseCase = new LoginUserUseCase(adminRepository,passwordHasher);
const getUserUseCase = new GetUserUseCase(adminRepository)





//middleware
    const  authMiddleware  = new  AuthMiddleware (adminRepository,tokenService);


    //controller

const countryController = new CountryController(
  createCountryUseCase,
  getAllCountriesUseCase,
  updateCountryUseCase,
  deleteCountryUseCase
);

 const authController = new AuthController(createUserUseCase,loginUserUseCase,tokenService,getUserUseCase);
 

    const countryRoutes = new CountryRoutes(countryController, authMiddleware );
    const authRoutes  = new AuthRoutes(authController,authMiddleware);

    return {
        countryRoutes,
        authRoutes
    }
}