useEffect(() => {
    const fetchEmailData = async () => {
      if (!reference) return;

      try {
        setIsLoading(true);

        // Try to get pending payment data first
        let response = await fetch(`/api/pending-payments/${reference}`);

        if (!response.ok) {
          // If not found in pending payments, try regular bookings
          response = await fetch(`/api/bookings/${reference}`);
        }

        if (response.ok) {
          const bookingData = await response.json();

          // Get email preview - this endpoint doesn't actually send email, just returns preview
          const emailResponse = await fetch(`/api/pending-payments/${reference}/send-email`, {
            method: "POST"
          });

          if (emailResponse.ok) {
            const emailResult = await emailResponse.json();
            setEmailData({
              ...bookingData,
              emailPreview: emailResult.emailPreview
            });
          } else {
            // Fallback to booking data without email preview
            setEmailData(bookingData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch email data:", error);
        toast({
          title: "Error",
          description: "Failed to load email preview",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailData();
  }, [reference, toast]);