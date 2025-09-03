interface ServiceData {
  price: number;
}

async function getServiceData(id: string): Promise<ServiceData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/${id}`, {
      cache: 'no-store'
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const data = await getServiceData(id);
  const priceText = data ? `${data.price} ₽` : 'Неизвестно';
  return {
    title: `Стоимость услуги: ${priceText}`
  };
}

export default async function ServicePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const data = await getServiceData(id);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#141414' }}>
        <h1 className="text-4xl font-bold" style={{ color: '#eaeaea' }}>
          Ошибка загрузки услуги
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#141414' }}>
      <h1 className="text-5xl font-bold" style={{ color: '#eaeaea' }}>
        Стоимость услуги: {data.price} ₽
      </h1>
    </div>
  );
}
