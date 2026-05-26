"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserInformation } from "@/services/userService";

/**
 * Hook de React para consumir la información de un usuario a partir de su email de forma reactiva.
 * 
 * @param {string} email - Correo del usuario.
 * @returns {{
 *   data: {
 *     userName: string,
 *     amountBalance: number,
 *     games: Array<{
 *       id: string,
 *       name: string,
 *       description: string,
 *       price: number,
 *       company: string,
 *       imageUrl: string,
 *       categories: Array<string>,
 *       releaseDate: string
 *     }>
 *   } | null,
 *   loading: boolean,
 *   error: Error | null,
 *   refetch: () => void
 * }} Estados y función de reintento/actualización de la petición.
 */
export function useUserInformation(email) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!email) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getUserInformation(email);
      setData(result);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    data,
    loading,
    error,
    refetch: fetchUser,
  };
}
