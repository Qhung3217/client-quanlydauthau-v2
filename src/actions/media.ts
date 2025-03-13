import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.media;

// ----------------------------------------------------------------------
type IMediaResponse = {
  response: {
    id: string;
    name: string;
    path: string;
    createdAt: Date;
  };
};

export async function uploadSingleFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axios.post<IMediaResponse>(ENDPOINT.upload_one, formData);

  return data.response;
}

export async function uploadMultiFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const { data } = await axios.post<{
    response: {
      id: string;
      name: string;
      path: string;
      createdAt: Date;
    }[];
  }>(ENDPOINT.upload_many, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.response;
}
