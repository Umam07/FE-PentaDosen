export const externalDocumentsService = {
  /**
   * Update corresponding author status for a Scopus publication.
   */
  updateCorrespondingStatus: async (docId: string | number, isCorresponding: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`/api/scopus-publications/${docId}/corresponding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_corresponding: isCorresponding }),
      });
      return res.ok;
    } catch (err) {
      console.error('Error updating corresponding status:', err);
      return false;
    }
  }
};
