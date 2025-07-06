import { ContentItem } from '@/types/content';

class ContentStorage {
  private storageKey = 'creator-vault-contents';

  saveContent(content: ContentItem): void {
    try {
      const existingContents = this.getAllContents();
      const updatedContents = existingContents.filter(item => item.id !== content.id);
      updatedContents.push(content);
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedContents));
      console.log('Content saved successfully:', content.id);
    } catch (error) {
      console.error('Failed to save content:', error);
      throw new Error('Failed to save content to local storage');
    }
  }

  getAllContents(): ContentItem[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load contents:', error);
      return [];
    }
  }

  getContent(id: string): ContentItem | null {
    try {
      const contents = this.getAllContents();
      return contents.find(content => content.id === id) || null;
    } catch (error) {
      console.error('Failed to get content:', error);
      return null;
    }
  }

  deleteContent(id: string): void {
    try {
      const contents = this.getAllContents();
      const updatedContents = contents.filter(content => content.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedContents));
    } catch (error) {
      console.error('Failed to delete content:', error);
      throw new Error('Failed to delete content');
    }
  }

  incrementViews(id: string): void {
    try {
      const contents = this.getAllContents();
      const content = contents.find(c => c.id === id);
      if (content) {
        content.views = (content.views || 0) + 1;
        localStorage.setItem(this.storageKey, JSON.stringify(contents));
      }
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  }

  incrementLikes(id: string): void {
    try {
      const contents = this.getAllContents();
      const content = contents.find(c => c.id === id);
      if (content) {
        content.likes = (content.likes || 0) + 1;
        localStorage.setItem(this.storageKey, JSON.stringify(contents));
      }
    } catch (error) {
      console.error('Failed to increment likes:', error);
    }
  }

  getContentsByCreator(creatorAddress: string): ContentItem[] {
    try {
      const contents = this.getAllContents();
      return contents.filter(content => content.creatorAddress === creatorAddress);
    } catch (error) {
      console.error('Failed to get contents by creator:', error);
      return [];
    }
  }

  searchContents(query: string): ContentItem[] {
    try {
      const contents = this.getAllContents();
      const searchTerm = query.toLowerCase();
      
      return contents.filter(content => 
        content.title.toLowerCase().includes(searchTerm) ||
        content.description.toLowerCase().includes(searchTerm) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        content.creatorName.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Failed to search contents:', error);
      return [];
    }
  }
}

export const contentStorage = new ContentStorage();
