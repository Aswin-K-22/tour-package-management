//back-end\\src\\app.composer.ts'
import { CreateUserUseCase } from "./application/usecases/auth/createUserUseCase";
import { GetUserUseCase } from "./application/usecases/auth/getUserUseCase";
import { LoginUserUseCase } from "./application/usecases/auth/loginUserUseCase";
import { CreateCityUseCase } from "./application/usecases/city/CreateCityUseCase";
import { DeleteCityUseCase } from "./application/usecases/city/DeleteCityUseCase";
import { GetAllCitiesAlphabeticalUseCase } from "./application/usecases/city/GetAllCitiesAlphabeticalUseCase";
import { GetAllCitiesUseCase } from "./application/usecases/city/GetAllCitiesUseCase";
import { GetCitiesByCountryIdUseCase } from "./application/usecases/city/GetCitiesByCountryIdUseCase";
import { UpdateCityUseCase } from "./application/usecases/city/UpdateCityUseCase";
import { CreateCountryUseCase } from "./application/usecases/country/CreateCountryUseCase";
import { DeleteCountryUseCase } from "./application/usecases/country/DeleteCountryUseCase";
import { GetAllCountriesAlphabeticalUseCase } from "./application/usecases/country/GetAllCountriesAlphabeticalUseCase";
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
import { CityController } from "./presentation/controllers/CityController";
import { CountryController } from "./presentation/controllers/country-controller";
import { AuthMiddleware } from "./presentation/middlewares/authMiddleware";
import { AuthRoutes } from "./presentation/routes/auth-router";
import { CityRoutes } from "./presentation/routes/city-routes";
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
const deleteCountryUseCase = new DeleteCountryUseCase(countryRepository, cityRepository);


const getAllCountriesAlphabeticalUseCase = new GetAllCountriesAlphabeticalUseCase(countryRepository);


const createCityUseCase = new CreateCityUseCase(cityRepository);
const getAllCitiesUseCase = new GetAllCitiesUseCase(cityRepository);
const updateCityUseCase = new UpdateCityUseCase(cityRepository);
const deleteCityUseCase = new DeleteCityUseCase(cityRepository);
const getAllCitiesAlphabeticalUseCase = new GetAllCitiesAlphabeticalUseCase(cityRepository);
const getCitiesByCountryIdUseCase = new GetCitiesByCountryIdUseCase(cityRepository);




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
  deleteCountryUseCase,
  getAllCountriesAlphabeticalUseCase
);

const cityController = new CityController(
  createCityUseCase,
  getAllCitiesUseCase,
  updateCityUseCase,
  deleteCityUseCase,
  getAllCitiesAlphabeticalUseCase,
  getCitiesByCountryIdUseCase
);




 const authController = new AuthController(createUserUseCase,loginUserUseCase,tokenService,getUserUseCase);
 

    const countryRoutes = new CountryRoutes(countryController, authMiddleware );
    const authRoutes  = new AuthRoutes(authController,authMiddleware);
    const cityRoutes = new CityRoutes(cityController, authMiddleware);


return {
  countryRoutes,
  authRoutes,
  cityRoutes,
};

}