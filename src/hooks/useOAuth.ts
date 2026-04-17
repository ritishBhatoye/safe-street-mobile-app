import { useEffect } from "react";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export const useOAuth = () => {
  const redirectUrl = makeRedirectUri({
    scheme: "safestreet",
    path: "auth/callback",
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        showToast.success("Welcome!", "Successfully signed in");
        router.replace("/(tabs)/home");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        if (result.type === "success") {
          const url = result.url;
          const params = new URL(url).searchParams;
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        }
      }
    } catch (error: any) {
      showToast.error("Error", error.message || "Failed to sign in with Google");
    }
  };

  return {
    signInWithGoogle,
  };
};
