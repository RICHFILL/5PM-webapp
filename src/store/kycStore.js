import { create } from 'zustand';
import { KYC_STEPS } from '../constants';

const initialState = {
  currentStep: 0,
  personalInfo: { firstName: '', lastName: '', dob: '', gender: '' },
  addressInfo: { country: '', state: '', city: '', address: '' },
  identityInfo: { bvn: '', nin: '' },
  documents: { passport: null, governmentId: null, utilityBill: null },
  selfie: null,
  status: null,
};

const useKycStore = create((set) => ({
  ...initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, KYC_STEPS.length - 1) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  setPersonalInfo: (data) => set({ personalInfo: data }),
  setAddressInfo: (data) => set({ addressInfo: data }),
  setIdentityInfo: (data) => set({ identityInfo: data }),
  setDocuments: (data) => set({ documents: data }),
  setSelfie: (data) => set({ selfie: data }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

export default useKycStore;
