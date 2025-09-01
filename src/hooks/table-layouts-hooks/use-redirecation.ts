import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessCenter } from '@/contexts/businesscenter-context';

export function useRedirection() {
  const { selectedBCId } = useBusinessCenter();
  const prevBCIdRef = useRef<string | number | null>(null);
  const isFirstRenderRef = useRef(true);
  const router = useRouter();
  useEffect(() => {
    if (selectedBCId == null) return;

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevBCIdRef.current = selectedBCId;
      return;
    }

    if (selectedBCId != prevBCIdRef.current) {
      prevBCIdRef.current = selectedBCId;
      router.push(`/table-layouts`);
    }

  }, [selectedBCId, router]);
}
