import { axiosInstance } from './axiosInstance';



//add book
export const GetReports = async () => {
    try {
        const response = await axiosInstance.get("/api/reports/get-reports");
        return response.data;
    } catch (error) {
        console.log(error);
    }
};