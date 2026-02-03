'use server';

import { auth } from './config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server Action pour se connecter
 * Utilise l'API HTTP de Better-Auth pour une meilleure compatibilité
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns { error?: string, success?: boolean } - Résultat de la connexion
 */
export async function signIn(email: string, password: string) {
  try {
    console.log('=== SIGNIN START ===');
    console.log('Email:', email);
    
    // Utiliser directement l'API route handler de Better-Auth
    const cookieStore = await cookies();
    const cookieHeader = Array.from(cookieStore.getAll())
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    // Créer une requête Request pour l'API route handler
    // Better-Auth utilise le format /api/auth/sign-in/email
    // Le handler [...all] capture tout sous /api/auth/*
    const baseURL = process.env.BETTER_AUTH_URL || process.env.AUTH_URL || 'http://localhost:3000';
    const requestUrl = new URL(`${baseURL}/api/auth/sign-in/email`);
    const request = new Request(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'Origin': baseURL, // Nécessaire pour Better-Auth
        'Referer': `${baseURL}/auth/login`, // Aide pour la sécurité
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('=== SIGNIN REQUEST URL ===', requestUrl.toString());
    console.log('=== SIGNIN REQUEST PATHNAME ===', requestUrl.pathname);
    console.log('=== SIGNIN REQUEST BODY ===', JSON.stringify({ email, password: '***' }));

    // Appeler directement l'API route handler
    const { POST } = await import('@/app/api/auth/[...all]/route');
    
    let response: Response;
    try {
      response = await POST(request);
      console.log('=== SIGNIN RESPONSE RECEIVED ===');
    } catch (handlerError) {
      console.error('=== SIGNIN HANDLER ERROR ===');
      console.error('Error:', handlerError);
      throw handlerError;
    }
    
    console.log('=== SIGNIN RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Extraire et définir les cookies de la réponse
    // Next.js 15+ utilise getSetCookie() au lieu de get('set-cookie')
    let setCookieHeaders: string[] = [];
    try {
      // Essayer getSetCookie() d'abord (Next.js 15+)
      if (typeof response.headers.getSetCookie === 'function') {
        setCookieHeaders = response.headers.getSetCookie();
        console.log('=== SIGNIN USING getSetCookie() ===', setCookieHeaders.length, 'cookies');
      } else {
        // Fallback pour Next.js 14
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
          setCookieHeaders = [setCookieHeader];
        }
        console.log('=== SIGNIN USING get(set-cookie) ===', setCookieHeaders.length, 'cookies');
      }
    } catch (e) {
      console.error('=== SIGNIN COOKIE EXTRACTION ERROR ===', e);
    }
    
    console.log('=== SIGNIN SET-COOKIE HEADERS ===', setCookieHeaders);
    
    if (setCookieHeaders.length > 0) {
      // getSetCookie() retourne déjà un tableau de cookies, pas besoin de parser
      for (const cookieString of setCookieHeaders) {
        // Parser le cookie (format: name=value; attributes)
        const parts = cookieString.split(';');
        const [nameValue] = parts;
        const [name, ...valueParts] = nameValue.split('=');
        const value = valueParts.join('='); // En cas de = dans la valeur
        
        if (name && value) {
          // Extraire les attributs
          const cookieOptions: any = {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 jours par défaut
          };
          
          parts.slice(1).forEach(attr => {
            const trimmed = attr.trim().toLowerCase();
            if (trimmed === 'httponly') {
              cookieOptions.httpOnly = true;
            } else if (trimmed === 'secure') {
              cookieOptions.secure = true;
            } else if (trimmed.startsWith('samesite=')) {
              const sameSite = trimmed.split('=')[1];
              cookieOptions.sameSite = sameSite === 'strict' ? 'strict' : 
                                      sameSite === 'none' ? 'none' : 'lax';
            } else if (trimmed.startsWith('max-age=')) {
              cookieOptions.maxAge = parseInt(trimmed.split('=')[1]);
            } else if (trimmed.startsWith('path=')) {
              cookieOptions.path = trimmed.split('=')[1];
            } else if (trimmed.startsWith('expires=')) {
              // Ignorer expires, on utilise maxAge
            }
          });
          
          cookieStore.set(name.trim(), value.trim(), cookieOptions);
          console.log(`=== SIGNIN COOKIE SET: ${name.trim()} ===`, {
            hasValue: !!value.trim(),
            httpOnly: cookieOptions.httpOnly,
            secure: cookieOptions.secure,
            sameSite: cookieOptions.sameSite,
            maxAge: cookieOptions.maxAge,
          });
        } else {
          console.log('=== SIGNIN COOKIE PARSE FAILED ===', cookieString);
        }
      }
    } else {
      console.log('=== SIGNIN NO SET-COOKIE HEADER ===');
    }

    // Lire les données de la réponse
    let data: any;
    try {
      const text = await response.text();
      console.log('=== SIGNIN RESPONSE TEXT ===', text);
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('=== SIGNIN PARSE ERROR ===', parseError);
      return { error: 'Erreur lors de la lecture de la réponse du serveur' };
    }
    
    console.log('=== SIGNIN DATA ===', JSON.stringify(data, null, 2));

    if (!response.ok) {
      const errorMessage = data.error?.message || data.error || `Erreur ${response.status}: ${response.statusText}`;
      console.error('=== SIGNIN ERROR (NOT OK) ===', errorMessage);
      return { error: errorMessage };
    }

    if (data.error) {
      const errorMessage = data.error?.message || data.error || 'Erreur lors de la connexion';
      console.error('=== SIGNIN ERROR (DATA ERROR) ===', errorMessage);
      return { error: errorMessage };
    }

    console.log('=== SIGNIN SUCCESS ===');
    return { success: true };
  } catch (error) {
    console.error('=== SIGNIN EXCEPTION ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Une erreur est survenue lors de la connexion';
    return { error: errorMessage };
  }
}

/**
 * Server Action pour s'inscrire
 * Utilise l'API HTTP de Better-Auth pour une meilleure compatibilité
 * @param name - Nom complet de l'utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns { error?: string, success?: boolean } - Résultat de l'inscription
 */
export async function signUp(name: string, email: string, password: string) {
  try {
    console.log('=== SIGNUP START ===');
    console.log('Email:', email);
    console.log('Name:', name);
    
    // Utiliser directement l'API de Better-Auth avec les headers appropriés
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: headers as any,
    });

    console.log('=== SIGNUP RESULT ===');
    console.log('Result type:', typeof result);
    console.log('Result keys:', result ? Object.keys(result) : 'null');
    console.log('Result:', JSON.stringify(result, null, 2));

    // Si on arrive ici, l'inscription a réussi
    // result contient { user, token } ou { user, token: null } si requireEmailVerification est true
    console.log('=== SIGNUP SUCCESS ===');
    return { success: true };
  } catch (error) {
    console.error('=== SIGNUP EXCEPTION ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // Essayer d'extraire plus d'informations de l'erreur
    if (error && typeof error === 'object') {
      try {
        console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      } catch (e) {
        console.error('Could not stringify error');
      }
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erreur lors de la création du compte. Vérifiez que la base de données est correctement configurée.';
    return { error: errorMessage };
  }
}

/**
 * Server Action pour se déconnecter
 */
export async function signOut() {
  try {
    console.log('=== SIGNOUT START ===');
    
    // Utiliser directement l'API route handler de Better-Auth
    const cookieStore = await cookies();
    const cookieHeader = Array.from(cookieStore.getAll())
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    // Créer une requête Request pour l'API route handler
    const baseURL = process.env.BETTER_AUTH_URL || process.env.AUTH_URL || 'http://localhost:3000';
    const requestUrl = new URL(`${baseURL}/api/auth/sign-out`);
    const request = new Request(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'Origin': baseURL,
      },
    });

    // Appeler directement l'API route handler
    const { POST } = await import('@/app/api/auth/[...all]/route');
    const response = await POST(request);
    
    console.log('=== SIGNOUT RESPONSE ===');
    console.log('Status:', response.status);
    
    // Extraire et supprimer les cookies de la réponse
    let setCookieHeaders: string[] = [];
    try {
      if (typeof response.headers.getSetCookie === 'function') {
        setCookieHeaders = response.headers.getSetCookie();
      } else {
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
          setCookieHeaders = [setCookieHeader];
        }
      }
    } catch (e) {
      console.error('=== SIGNOUT COOKIE EXTRACTION ERROR ===', e);
    }
    
    // Supprimer tous les cookies d'authentification
    const authCookieNames = ['better-auth.session_token', 'better-auth.session', 'session'];
    for (const cookieName of authCookieNames) {
      try {
        cookieStore.delete(cookieName);
        console.log(`=== SIGNOUT COOKIE DELETED: ${cookieName} ===`);
      } catch (e) {
        // Ignore errors for cookies that don't exist
      }
    }
    
    // Supprimer tous les cookies qui commencent par "better-auth"
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      if (cookie.name.startsWith('better-auth') || cookie.name.includes('session')) {
        try {
          cookieStore.delete(cookie.name);
          console.log(`=== SIGNOUT COOKIE DELETED: ${cookie.name} ===`);
        } catch (e) {
          // Ignore errors
        }
      }
    }
    
    console.log('=== SIGNOUT SUCCESS ===');
    redirect('/');
  } catch (error) {
    console.error('=== SIGNOUT EXCEPTION ===');
    console.error('Error:', error);
    // Même en cas d'erreur, supprimer les cookies et rediriger
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      for (const cookie of allCookies) {
        if (cookie.name.startsWith('better-auth') || cookie.name.includes('session')) {
          cookieStore.delete(cookie.name);
        }
      }
    } catch (e) {
      // Ignore cleanup errors
    }
    redirect('/');
  }
}

/**
 * Server Action pour récupérer la session actuelle
 * @returns Session utilisateur ou null
 */
export async function getSession() {
  try {
    console.log('=== GETSESSION START ===');
    
    // Utiliser directement l'API route handler de Better-Auth
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('=== GETSESSION ALL COOKIES ===', allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })));
    
    const cookieHeader = Array.from(allCookies)
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    console.log('=== GETSESSION COOKIE HEADER ===', cookieHeader ? cookieHeader.substring(0, 100) + '...' : 'EMPTY');
    
    // Créer une requête Request pour l'API route handler
    const baseURL = process.env.BETTER_AUTH_URL || process.env.AUTH_URL || 'http://localhost:3000';
    const requestUrl = new URL(`${baseURL}/api/auth/get-session`);
    const request = new Request(requestUrl, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
        'Origin': baseURL, // Nécessaire pour Better-Auth
      },
    });

    // Appeler directement l'API route handler
    const { GET } = await import('@/app/api/auth/[...all]/route');
    const response = await GET(request);
    
    console.log('=== GETSESSION RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.log('=== GETSESSION NOT OK ===', response.status, errorText);
      return null;
    }

    const session = await response.json();
    console.log('=== GETSESSION RESULT ===');
    console.log('Session:', JSON.stringify(session, null, 2));

    if (!session || !session.user) {
      console.log('=== GETSESSION NO USER ===');
      return null;
    }

    console.log('=== GETSESSION SUCCESS ===');
    return session;
  } catch (error) {
    console.error('=== GETSESSION EXCEPTION ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * Helper pour obtenir les headers de la requête avec les cookies
 * Nécessaire pour Better-Auth dans les Server Actions
 */
async function getRequestHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const cookieHeader = Array.from(cookieStore.getAll())
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
  
  return {
    cookie: cookieHeader,
  } as HeadersInit;
}
