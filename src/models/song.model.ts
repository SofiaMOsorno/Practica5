export interface Song {
    id: string;
    title: string;
    artist: string;
    album?: string;
    year?: number;
    genre?: string;
    duration?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSongDto {
    title: string;
    artist: string;
    album?: string;
    year?: number;
    genre?: string;
    duration?: number;
}

export interface UpdateSongDto {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
    duration?: number;
}

export function validateCreateSong(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push('title is required and must be a non-empty string');
    }

    if (!data.artist || typeof data.artist !== 'string' || data.artist.trim() === '') {
        errors.push('artist is required and must be a non-empty string');
    }

    if (data.album !== undefined && (typeof data.album !== 'string' || data.album.trim() === '')) {
        errors.push('album must be a non-empty string if provided');
    }

    if (data.year !== undefined && (typeof data.year !== 'number' || data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
        errors.push('year must be a valid number between 1900 and current year');
    }

    if (data.genre !== undefined && (typeof data.genre !== 'string' || data.genre.trim() === '')) {
        errors.push('genre must be a non-empty string if provided');
    }

    if (data.duration !== undefined && (typeof data.duration !== 'number' || data.duration <= 0)) {
        errors.push('duration must be a positive number if provided');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateUpdateSong(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (Object.keys(data).length === 0) {
        errors.push('At least one field must be provided for update');
    }

    if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim() === '')) {
        errors.push('title must be a non-empty string if provided');
    }

    if (data.artist !== undefined && (typeof data.artist !== 'string' || data.artist.trim() === '')) {
        errors.push('artist must be a non-empty string if provided');
    }

    if (data.album !== undefined && (typeof data.album !== 'string' || data.album.trim() === '')) {
        errors.push('album must be a non-empty string if provided');
    }

    if (data.year !== undefined && (typeof data.year !== 'number' || data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
        errors.push('year must be a valid number between 1900 and current year');
    }

    if (data.genre !== undefined && (typeof data.genre !== 'string' || data.genre.trim() === '')) {
        errors.push('genre must be a non-empty string if provided');
    }

    if (data.duration !== undefined && (typeof data.duration !== 'number' || data.duration <= 0)) {
        errors.push('duration must be a positive number if provided');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}