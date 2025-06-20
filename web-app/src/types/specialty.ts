export interface SpecialtyCreationRequest {
    specialtyName: string,
    description: string
}

export interface SpecialtyCreationResponse {
    id: number,
    specialtyName: string,
    description: string,
    doctorNumber: number,
    patientNumber: number
}

export interface SpecialtyDetailResponse {
    id: number,
    specialtyName: string,
    description: string,
    doctorNumber: number,
    patientNumber: number
}