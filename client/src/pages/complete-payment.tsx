useEffect(() => {
    const fetchPendingPayment = async () => {
      if (!reference) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/pending-payments/${reference}`);

        if (!response.ok) {
          throw new Error("Pending payment not found");
        }

        const data = await response.json();

        // Check if payment is still pending
        if (data.status !== 'pending') {
          toast({
            title: "Payment Status",
            description: `This payment has already been ${data.status}`,
            variant: data.status === 'completed' ? 'default' : 'destructive',
          });
        }

        setPendingPayment(data);

        // Fetch flight details
        const flightResponse = await fetch(`/api/flights/${data.flightId}`);
        if (flightResponse.ok) {
          const flightData = await flightResponse.json();
          setFlight(flightData);
        }
      } catch (error) {
        console.error("Error fetching pending payment:", error);
        toast({
          title: "Error",
          description: "Unable to load pending payment details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPayment();
  }, [reference, toast]);