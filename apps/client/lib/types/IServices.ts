import { RapierPhysicsService } from "../services/RapierPhysicsService";
import { ThreeRenderService } from "../services/ThreeRenderService";

export type IRenderService = { renderService: ThreeRenderService };
export type IPhysicsService = { physicsService: RapierPhysicsService } & IRenderService;

