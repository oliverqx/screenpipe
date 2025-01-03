import { z } from 'zod';
import { PermissionStateWithUIRelatedStates } from './permission-state';


// the following zod schema is not using AvailablePeripheralDevices to generate its keys because it would require either
// 1. z.record(
//      z.nativeEnum(AvailablePeripheralDevices),
//      z.nativeEnum(OSPermissionStatusEnum),
//    ) 
//    which translates to Record<AvailablePeripheralDevices, string>, loosing strict validation for its values. 
// 2. some really obnoxious generator function.
export const OSPermissionsStatesPerDeviceZodSchema = z.object({
    screenRecording: z.nativeEnum(PermissionStateWithUIRelatedStates),
    microphone: z.nativeEnum(PermissionStateWithUIRelatedStates),
    accessibility: z.nativeEnum(PermissionStateWithUIRelatedStates),
})
  
export type OSPermissionsStatesPerDevice = z.infer<typeof OSPermissionsStatesPerDeviceZodSchema>;