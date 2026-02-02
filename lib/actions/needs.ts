'use server';

import { db } from '@/lib/db';
import { needs, participations } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/actions';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

export async function createNeed(formData: {
  title: string;
  description: string;
  category: string;
  city: string;
  whatsapp: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}) {
  try {
    console.log('=== CREATENEED START ===');
    const session = await getSession();
    
    if (!session?.user) {
      console.log('=== CREATENEED NO SESSION ===');
      return { error: 'Vous devez être connecté pour publier un besoin' };
    }

    console.log('=== CREATENEED USER ID ===', session.user.id);
    console.log('=== CREATENEED FORM DATA ===', formData);

    // Valider que la catégorie est valide
    const validCategories = ['Environnement', 'Éducation', 'Social', 'Alimentation', 'Santé', 'Autre'];
    if (!validCategories.includes(formData.category)) {
      console.error('=== CREATENEED INVALID CATEGORY ===', formData.category);
      return { error: `Catégorie invalide: "${formData.category}". Catégories valides: ${validCategories.join(', ')}` };
    }

    // Valider que le niveau d'urgence est valide
    const validUrgencyLevels = ['low', 'medium', 'high'];
    if (!validUrgencyLevels.includes(formData.urgencyLevel)) {
      console.error('=== CREATENEED INVALID URGENCY LEVEL ===', formData.urgencyLevel);
      return { error: `Niveau d'urgence invalide: "${formData.urgencyLevel}"` };
    }

    const needId = nanoid();

    await db.insert(needs).values({
      id: needId,
      title: formData.title,
      description: formData.description,
      category: formData.category as any,
      city: formData.city,
      whatsapp: formData.whatsapp,
      urgencyLevel: formData.urgencyLevel,
      userId: session.user.id,
      status: 'open',
    });

    console.log('=== CREATENEED INSERTED ===', needId);

    revalidatePath('/');
    revalidatePath('/dashboard');
    
    console.log('=== CREATENEED SUCCESS ===');
    return { success: true, id: needId };
  } catch (error) {
    console.error('=== CREATENEED EXCEPTION ===');
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
    
    // Retourner un message d'erreur plus spécifique
    const errorMessage = error instanceof Error 
      ? `Erreur lors de la publication: ${error.message}`
      : 'Une erreur est survenue lors de la publication du besoin';
    
    return { error: errorMessage };
  }
}

export async function participateInNeed(needId: string) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return { error: 'Vous devez être connecté pour participer' };
    }

    // Vérifier si l'utilisateur a déjà participé
    const existingParticipation = await db
      .select()
      .from(participations)
      .where(
        and(
          eq(participations.needId, needId),
          eq(participations.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingParticipation.length > 0) {
      return { error: 'Vous participez déjà à ce besoin' };
    }

    // Vérifier si l'utilisateur est le créateur du besoin
    const need = await db
      .select()
      .from(needs)
      .where(eq(needs.id, needId))
      .limit(1);

    if (need.length > 0 && need[0].userId === session.user.id) {
      return { error: 'Vous ne pouvez pas participer à votre propre besoin' };
    }

    await db.insert(participations).values({
      id: nanoid(),
      needId,
      userId: session.user.id,
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error participating in need:', error);
    return { error: 'Une erreur est survenue lors de la participation' };
  }
}

export async function markNeedAsResolved(needId: string) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return { error: 'Vous devez être connecté' };
    }

    // Vérifier que l'utilisateur est le créateur du besoin
    const need = await db
      .select()
      .from(needs)
      .where(eq(needs.id, needId))
      .limit(1);

    if (need.length === 0) {
      return { error: 'Besoin introuvable' };
    }

    if (need[0].userId !== session.user.id) {
      return { error: 'Vous n\'êtes pas autorisé à modifier ce besoin' };
    }

    await db
      .update(needs)
      .set({ status: 'completed', updatedAt: new Date() })
      .where(eq(needs.id, needId));

    revalidatePath('/');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error marking need as resolved:', error);
    return { error: 'Une erreur est survenue' };
  }
}

export async function getNeeds(filters?: {
  city?: string;
  category?: string;
}) {
  try {
    console.log('=== GETNEEDS START ===', filters);
    const conditions = [eq(needs.status, 'open')];
    
    if (filters?.city) {
      conditions.push(eq(needs.city, filters.city));
    }

    if (filters?.category) {
      conditions.push(eq(needs.category, filters.category as any));
    }

    const needsList = await db
      .select({
        id: needs.id,
        title: needs.title,
        description: needs.description,
        category: needs.category,
        city: needs.city,
        whatsapp: needs.whatsapp,
        urgencyLevel: needs.urgencyLevel,
        status: needs.status,
        userId: needs.userId,
        createdAt: needs.createdAt,
        updatedAt: needs.updatedAt,
      })
      .from(needs)
      .where(and(...conditions))
      .orderBy(desc(needs.createdAt));

    console.log('=== GETNEEDS FOUND ===', needsList.length, 'needs');

    // Récupérer le nombre de participants pour chaque besoin
    const needsWithParticipants = await Promise.all(
      needsList.map(async (need) => {
        const participants = await db
          .select()
          .from(participations)
          .where(eq(participations.needId, need.id));

        return {
          id: need.id,
          title: need.title,
          description: need.description,
          category: need.category,
          city: need.city,
          whatsapp: need.whatsapp,
          urgencyLevel: need.urgencyLevel,
          status: need.status,
          userId: need.userId,
          createdAt: need.createdAt instanceof Date ? need.createdAt.toISOString() : need.createdAt,
          updatedAt: need.updatedAt instanceof Date ? need.updatedAt.toISOString() : need.updatedAt,
          volunteersCount: participants.length,
        };
      })
    );

    console.log('=== GETNEEDS SUCCESS ===', needsWithParticipants.length, 'needs with participants');
    return { success: true, data: needsWithParticipants };
  } catch (error) {
    console.error('=== GETNEEDS EXCEPTION ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return { error: 'Une erreur est survenue lors de la récupération des besoins' };
  }
}

export async function getUserNeeds() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return { error: 'Vous devez être connecté' };
    }

    const userNeeds = await db
      .select({
        id: needs.id,
        title: needs.title,
        description: needs.description,
        category: needs.category,
        city: needs.city,
        whatsapp: needs.whatsapp,
        urgencyLevel: needs.urgencyLevel,
        status: needs.status,
        createdAt: needs.createdAt,
        updatedAt: needs.updatedAt,
      })
      .from(needs)
      .where(eq(needs.userId, session.user.id))
      .orderBy(desc(needs.createdAt));

    // Récupérer le nombre de participants pour chaque besoin
    const needsWithParticipants = await Promise.all(
      userNeeds.map(async (need) => {
        const participants = await db
          .select()
          .from(participations)
          .where(eq(participations.needId, need.id));

        return {
          id: need.id,
          title: need.title,
          description: need.description,
          category: need.category,
          city: need.city,
          whatsapp: need.whatsapp,
          urgencyLevel: need.urgencyLevel,
          status: need.status,
          createdAt: need.createdAt instanceof Date ? need.createdAt.toISOString() : need.createdAt,
          updatedAt: need.updatedAt instanceof Date ? need.updatedAt.toISOString() : need.updatedAt,
          volunteersCount: participants.length,
        };
      })
    );

    return { success: true, data: needsWithParticipants };
  } catch (error) {
    console.error('Error getting user needs:', error);
    return { error: 'Une erreur est survenue lors de la récupération de vos besoins' };
  }
}

export async function getUserParticipations() {
  try {
    console.log('=== GETUSERPARTICIPATIONS START ===');
    const session = await getSession();
    
    if (!session?.user) {
      console.log('=== GETUSERPARTICIPATIONS NO SESSION ===');
      return { error: 'Vous devez être connecté' };
    }

    console.log('=== GETUSERPARTICIPATIONS USER ID ===', session.user.id);

    const userParticipations = await db
      .select({
        id: participations.id,
        needId: participations.needId,
        createdAt: participations.createdAt,
      })
      .from(participations)
      .where(eq(participations.userId, session.user.id))
      .orderBy(desc(participations.createdAt));

    console.log('=== GETUSERPARTICIPATIONS FOUND ===', userParticipations.length, 'participations');

    // Récupérer les détails de chaque besoin
    const participationsWithNeeds = await Promise.all(
      userParticipations.map(async (participation) => {
        try {
          const need = await db
            .select()
            .from(needs)
            .where(eq(needs.id, participation.needId))
            .limit(1);

          if (need.length === 0) {
            console.log('=== GETUSERPARTICIPATIONS NEED NOT FOUND ===', participation.needId);
            return null;
          }

          const allParticipants = await db
            .select()
            .from(participations)
            .where(eq(participations.needId, participation.needId));

          return {
            id: need[0].id,
            title: need[0].title,
            description: need[0].description,
            category: need[0].category,
            city: need[0].city,
            whatsapp: need[0].whatsapp,
            urgencyLevel: need[0].urgencyLevel,
            status: need[0].status,
            createdAt: need[0].createdAt instanceof Date ? need[0].createdAt.toISOString() : need[0].createdAt,
            updatedAt: need[0].updatedAt instanceof Date ? need[0].updatedAt.toISOString() : need[0].updatedAt,
            participationDate: participation.createdAt instanceof Date ? participation.createdAt.toISOString() : participation.createdAt,
            volunteersCount: allParticipants.length,
          };
        } catch (err) {
          console.error('=== GETUSERPARTICIPATIONS ERROR PROCESSING ===', participation.needId, err);
          return null;
        }
      })
    );

    const validParticipations = participationsWithNeeds.filter((p) => p !== null);
    console.log('=== GETUSERPARTICIPATIONS VALID ===', validParticipations.length, 'participations');

    return { success: true, data: validParticipations };
  } catch (error) {
    console.error('=== GETUSERPARTICIPATIONS EXCEPTION ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    const errorMessage = error instanceof Error 
      ? `Erreur lors de la récupération de vos participations: ${error.message}`
      : 'Une erreur est survenue lors de la récupération de vos participations';
    
    return { error: errorMessage };
  }
}
