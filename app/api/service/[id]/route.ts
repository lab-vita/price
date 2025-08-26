import { NextResponse } from 'next/server';
import axios from 'axios';
import JwtTokenService from '@/lib/JwtTokenService';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // последний сегмент

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const jwtService = JwtTokenService.getInstance();
    const token = await jwtService.getToken();

    const response = await axios.get(`${process.env.API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch service data' }, { status: 500 });
  }
}
