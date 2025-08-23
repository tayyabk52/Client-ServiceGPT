import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Mic, User, Sparkles, Star, MapPin, Clock, Phone, MessageCircle, Heart, ExternalLink, X, Check, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ServiceProvider } from '../types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  timestamp: Date;
  serviceCategory?: 'plumbing' | 'electrical' | 'cleaning' | 'handyman' | 'painting' | 'moving' | 'hvac' | 'gardening';
  serviceProviders?: ServiceProvider[];
}

interface FloatingOrb {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  category: string;
}

const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [messageAnimating, setMessageAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showTypingBubble, setShowTypingBubble] = useState(false);
  const [typingText, setTypingText] = useState('');
  // WhatsApp outreach state
  const [waOpen, setWaOpen] = useState(false);
  const [waProvider, setWaProvider] = useState<ServiceProvider | null>(null);
  const [waPrefill, setWaPrefill] = useState('');
  const [waSending, setWaSending] = useState(false);
  const [waSent, setWaSent] = useState(false);
  // Container refs for precise scroll handling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get initial message from navigation state
  const initialMessage = location.state?.initialMessage;

  // Mock AI responses with sophisticated conversation flow
  const aiResponses = [
    {
      content: "Hello! 👋 I'm your AI service assistant. I'm here to help you find the perfect local service provider. What kind of service are you looking for today?",
      suggestions: [
        "I need a plumber for a leaky faucet",
        "Looking for electrical work",
        "Need house cleaning services",
        "Handyman for home repairs"
      ]
    },
    {
      content: "Great choice! 🔧 I can help you find excellent plumbing services. Could you tell me more details about what you need? This helps me match you with the most suitable professionals.",
      suggestions: [
        "Kitchen faucet is leaking",
        "Bathroom drain is clogged",
        "Water heater issues",
        "Pipe burst emergency"
      ],
      serviceCategory: 'plumbing' as const
    },
    {
      content: "Perfect! 🏠 For kitchen faucet leaks, I'll connect you with experienced plumbers in your area. What's your budget range and preferred timeline?",
      suggestions: [
        "Under $200, ASAP",
        "$200-500, within a week",
        "Budget flexible, quality first",
        "Emergency - today"
      ],
      serviceCategory: 'plumbing' as const
    },
    {
      content: "Excellent! ⚡ I understand you need electrical work. Safety is paramount with electrical issues. What specific electrical service do you require?",
      suggestions: [
        "Install new light fixtures",
        "Fix outlet not working",
        "Upgrade electrical panel",
        "Install ceiling fan"
      ],
      serviceCategory: 'electrical' as const
    },
    {
      content: "Wonderful! 🧽 House cleaning services can really make a difference. What type of cleaning service are you looking for?",
      suggestions: [
        "One-time deep cleaning",
        "Regular weekly cleaning",
        "Move-in/move-out cleaning",
        "Post-construction cleanup"
      ],
      serviceCategory: 'cleaning' as const
    },
    {
      content: "Great! 🔨 Handyman services are perfect for various home repairs. What kind of repairs or improvements do you need help with?",
      suggestions: [
        "Fix squeaky doors",
        "Mount TV on wall",
        "Repair drywall holes",
        "Install shelving"
      ],
      serviceCategory: 'handyman' as const
    }
  ];

  // Mock Service Providers Data
  const mockServiceProviders: ServiceProvider[] = [
    {
      id: '1',
      businessName: 'Elite Plumbing Solutions',
      category: 'Plumbing',
      rating: 4.9,
      reviewCount: 247,
      distance: '0.8 km',
      priceRange: '$$',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      services: ['Leak Repair', 'Faucet Installation', 'Pipe Replacement', 'Emergency Service'],
      responseTime: '15 min',
      completedJobs: 856,
      verified: true,
      available: true,
      phone: '+1 (555) 123-4567',
      whatsapp: '+1 (555) 123-4567',
      location: {
        address: '123 Service St, Your City',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      workingHours: {
        'Mon-Fri': '8:00 AM - 8:00 PM',
        'Sat-Sun': '9:00 AM - 6:00 PM'
      },
      specializations: ['Kitchen Plumbing', 'Bathroom Repairs', 'Emergency Repairs']
    },
    {
      id: '2',
      businessName: 'QuickFix Plumbers',
      category: 'Plumbing',
      rating: 4.7,
      reviewCount: 189,
      distance: '1.2 km',
      priceRange: '$',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      services: ['Basic Repairs', 'Unclogging', 'Faucet Repair', 'Quick Service'],
      responseTime: '30 min',
      completedJobs: 445,
      verified: true,
      available: true,
      phone: '+1 (555) 234-5678',
      whatsapp: '+1 (555) 234-5678',
      location: {
        address: '456 Quick Ave, Your City',
        coordinates: { lat: 40.7589, lng: -73.9851 }
      },
      workingHours: {
        'Mon-Fri': '7:00 AM - 9:00 PM',
        'Sat-Sun': '8:00 AM - 8:00 PM'
      },
      specializations: ['Budget Repairs', 'Quick Fixes', 'Drain Cleaning']
    },
    {
      id: '3',
      businessName: 'Premium Home Services',
      category: 'Plumbing',
      rating: 4.8,
      reviewCount: 312,
      distance: '2.1 km',
      priceRange: '$$$',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      services: ['Luxury Installations', 'High-End Repairs', 'Bathroom Remodeling', 'Premium Service'],
      responseTime: '45 min',
      completedJobs: 623,
      verified: true,
      available: false,
      phone: '+1 (555) 345-6789',
      whatsapp: '+1 (555) 345-6789',
      location: {
        address: '789 Premium Blvd, Your City',
        coordinates: { lat: 40.7831, lng: -73.9712 }
      },
      workingHours: {
        'Mon-Fri': '9:00 AM - 6:00 PM',
        'Sat': '10:00 AM - 4:00 PM',
        'Sun': 'Closed'
      },
      specializations: ['Luxury Fixtures', 'High-End Installations', 'Custom Solutions']
    },
    {
      id: '4',
      businessName: 'Reliable Plumbing Co.',
      category: 'Plumbing',
      rating: 4.6,
      reviewCount: 156,
      distance: '3.5 km',
      priceRange: '$$',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      services: ['General Repairs', 'Maintenance', 'Installation', 'Consultation'],
      responseTime: '1 hour',
      completedJobs: 378,
      verified: true,
      available: true,
      phone: '+1 (555) 456-7890',
      whatsapp: '+1 (555) 456-7890',
      location: {
        address: '321 Reliable Rd, Your City',
        coordinates: { lat: 40.7505, lng: -73.9934 }
      },
      workingHours: {
        'Mon-Fri': '8:00 AM - 6:00 PM',
        'Sat': '9:00 AM - 3:00 PM',
        'Sun': 'Emergency Only'
      },
      specializations: ['Preventive Maintenance', 'System Diagnostics', 'Cost-Effective Solutions']
    }
  ];

  // Build/update prefilled message whenever selected provider changes
  useEffect(() => {
    if (waProvider) {
      const base = `Hello ${waProvider.businessName}! I discovered your ${waProvider.category.toLowerCase()} services via ServiceGPT. I have a requirement and would like to know availability & pricing.`;
      setWaPrefill(base + '\n\nDetails: [Add specifics here]\nTimeline: [e.g. ASAP / This week]\nBudget: [optional]\nLocation: [area]\n\nThanks!');
    }
  }, [waProvider]);

  const openWhatsAppModal = (provider: ServiceProvider) => {
    setWaProvider(provider);
    setWaOpen(true);
    setWaSending(false);
    setWaSent(false);
  };

  const simulateWaPrepare = () => {
    if (waSending || waSent) return;
    setWaSending(true);
    setTimeout(() => {
      setWaSending(false);
      setWaSent(true);
    }, 1200);
  };

  const buildWaLink = () => {
    if (!waProvider) return '#';
    const raw = (waProvider.whatsapp || waProvider.phone || '').replace(/[^\d+]/g, '');
    const number = raw.startsWith('+') ? raw.substring(1) : raw;
    const text = encodeURIComponent(waPrefill.replace(/\n/g,'\n'));
    return `https://wa.me/${number}?text=${text}`;
  };

  // Optimized orb initialization with staggered loading
  useEffect(() => {
    const initOrbs = () => {
      // Minimal orbs for better performance
      const orbCategories = [
        { name: 'plumbing', color: 'rgba(59, 130, 246, 0.15)', count: 1 },
        { name: 'electrical', color: 'rgba(168, 85, 247, 0.15)', count: 1 },
        { name: 'cleaning', color: 'rgba(34, 197, 94, 0.15)', count: 1 },
        { name: 'handyman', color: 'rgba(249, 115, 22, 0.15)', count: 1 }
      ];

      const newOrbs: FloatingOrb[] = [];
      orbCategories.forEach((category, categoryIndex) => {
        for (let i = 0; i < category.count; i++) {
          newOrbs.push({
            id: `${category.name}-${i}`,
            x: 20 + (categoryIndex * 25) + Math.random() * 10, // More controlled positioning
            y: 20 + Math.random() * 60,
            size: 20 + Math.random() * 15, // Consistent smaller size
            color: category.color,
            opacity: 0.1, // Very subtle
            category: category.name
          });
        }
      });
      setFloatingOrbs(newOrbs);
    };

    // Luxury Premium CSS Animations
    const style = document.createElement('style');
    style.textContent = `
      /* Luxury Entrance Animations */
      @keyframes luxurySlideUp {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          filter: blur(2px);
        }
        60% {
          opacity: 0.8;
          transform: translateY(-3px) scale(1.02);
          filter: blur(0.5px);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }
      }
      
      @keyframes premiumMessageSlide {
        0% {
          opacity: 0;
          transform: translateX(-25px) scale(0.95) rotateY(5deg);
          filter: blur(3px);
          box-shadow: 0 0 0 rgba(59, 130, 246, 0);
        }
        40% {
          opacity: 0.7;
          transform: translateX(5px) scale(1.03) rotateY(-1deg);
          filter: blur(1px);
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.2);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1) rotateY(0deg);
          filter: blur(0px);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
        }
      }
      
      @keyframes luxuryGlow {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0), 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        50% {
          box-shadow: 0 0 30px 8px rgba(59, 130, 246, 0.4), 0 20px 60px rgba(59, 130, 246, 0.2), 0 0 80px rgba(147, 51, 234, 0.1);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0), 0 8px 32px rgba(0, 0, 0, 0.1);
        }
      }
      
      @keyframes premiumPop {
        0% {
          opacity: 0;
          transform: translateY(15px) scale(0.9) rotateX(10deg);
          filter: blur(2px);
        }
        50% {
          opacity: 0.9;
          transform: translateY(-5px) scale(1.05) rotateX(-2deg);
          filter: blur(0.5px);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0deg);
          filter: blur(0px);
        }
      }
      
      @keyframes luxuryFadeIn {
        0% { 
          opacity: 0;
          transform: translateY(10px) scale(0.98);
          filter: blur(1px);
        }
        100% { 
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }
      }
      
      @keyframes premiumFloat {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg) scale(1); 
          opacity: 0.1;
          filter: blur(0px);
        }
        25% {
          transform: translateY(-12px) rotate(90deg) scale(1.1);
          opacity: 0.2;
          filter: blur(0.5px);
        }
        50% { 
          transform: translateY(-20px) rotate(180deg) scale(1.2); 
          opacity: 0.3;
          filter: blur(1px);
        }
        75% {
          transform: translateY(-12px) rotate(270deg) scale(1.1);
          opacity: 0.2;
          filter: blur(0.5px);
        }
      }
      
      @keyframes luxuryTypingAppear {
        0% {
          opacity: 0;
          transform: translateY(15px) scale(0.85) rotateX(15deg);
          filter: blur(3px);
        }
        60% {
          opacity: 0.8;
          transform: translateY(-2px) scale(1.05) rotateX(-5deg);
          filter: blur(1px);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0deg);
          filter: blur(0px);
        }
      }
      
      @keyframes premiumPulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        50% {
          transform: scale(1.02);
          box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.4), 0 20px 60px rgba(59, 130, 246, 0.2);
        }
      }
      
      @keyframes luxuryShimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      
      /* Luxury Animation Classes */
      .animate-luxury-slideUp {
        animation: luxurySlideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .animate-premium-slide {
        animation: premiumMessageSlide 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .animate-luxury-glow {
        animation: luxuryGlow 3s ease-in-out;
      }
      
      .animate-premium-pop {
        animation: premiumPop 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .animate-luxury-fadeIn {
        animation: luxuryFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .animate-luxury-typing {
        animation: luxuryTypingAppear 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .animate-premium-pulse {
        animation: premiumPulse 2s ease-in-out infinite;
      }
      
      .shimmer-effect {
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        background-size: 200% 100%;
        animation: luxuryShimmer 2s infinite;
      }
      
      /* Premium orb animations */
      .luxury-orb {
        animation: premiumFloat 18s ease-in-out infinite;
        will-change: transform, opacity, filter;
        transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
      }
      
      /* Premium Micro-interactions */
      .luxury-bubble {
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        backdrop-filter: blur(20px);
      }
      
      .luxury-bubble:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 40px rgba(59, 130, 246, 0.1);
        backdrop-filter: blur(24px);
      }
      
      .luxury-input-container {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      }
      
      .luxury-input-container:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
      }
      
      .luxury-input-container.focused {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.12));
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 20px 60px rgba(59, 130, 246, 0.15);
      }
      
      .luxury-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
        backdrop-filter: blur(24px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      }
      
      /* Professional textarea styling with no scrollbar */
      .luxury-textarea {
        background: transparent !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        caret-color: #60a5fa;
        color: white;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        font-weight: 400;
        line-height: 1.6;
      }
      
      /* Completely hide all scrollbars */
      .luxury-textarea::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        background: transparent !important;
      }
      
      .luxury-textarea::selection {
        background-color: rgba(96, 165, 250, 0.3);
        color: white;
      }
      
      .luxury-textarea::placeholder {
        color: rgba(255, 255, 255, 0.4);
        font-weight: 300;
      }
      
      /* Luxury Shimmer Effect */
      @keyframes shimmer {
        0% {
          transform: translateX(-100%) skewX(12deg);
        }
        100% {
          transform: translateX(200%) skewX(12deg);
        }
      }
      
      .animate-shimmer {
        position: relative;
        overflow: hidden;
      }
      
      .animate-shimmer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        animation: shimmer 2s infinite;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);

    // Staggered initialization for ultra-smooth loading
    const initTimer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    const orbTimer = setTimeout(() => {
      initOrbs();
      setIsInitializing(false);
    }, 300);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(orbTimer);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []); // Empty dependency array is intentional - only run once on mount

  // Track whether user is viewing bottom; only autoscroll if they are (improves mobile UX)
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Resize listener to set a CSS variable for mobile 100dvh fallback (iOS Safari compatibility)
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Scroll listener to update isAtBottom
  useEffect(() => {
    const c = messagesContainerRef.current;
    if (!c) return;
    const handleScroll = () => {
      const threshold = 64; // px tolerance
      const atBottom = c.scrollHeight - c.scrollTop - c.clientHeight < threshold;
      setIsAtBottom(atBottom);
    };
    c.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => c.removeEventListener('scroll', handleScroll);
  }, []);

  // Conditional auto-scroll (only if user was already at bottom when new content appears)
  useEffect(() => {
    if (!isAtBottom) return; // respect user scroll position
    const c = messagesContainerRef.current;
    if (!c) return;
    const id = requestAnimationFrame(() => {
      c.scrollTop = c.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [messages, isTyping, messageAnimating, isAtBottom]);

  // Professional conversation initialization
  useEffect(() => {
    if (messages.length === 0 && isReady) {
      // Staggered message loading for smooth UX
      const welcomeTimer = setTimeout(() => {
        const welcomeMessage: Message = {
          id: 'welcome',
          type: 'ai',
          content: aiResponses[0].content,
          suggestions: aiResponses[0].suggestions,
          timestamp: new Date()
        };
        
        setMessages([welcomeMessage]);
  // Welcome state removed (visual cue no longer needed)
        setConversationStep(1);
        
        // Handle initial message from dashboard
        if (initialMessage) {
          setHasInitialMessage(true);
          
          // Add user message with perfect timing
          setTimeout(() => {
            const userMessage: Message = {
              id: 'initial-user',
              type: 'user',
              content: initialMessage,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, userMessage]);
            setConversationStep(2);
            
            // AI response with optimized timing
            setTimeout(() => {
              setMessageAnimating(true);
              
              setTimeout(() => {
                const detectedCategory = detectServiceCategory(initialMessage);
                let aiResponse;
                
                if (detectedCategory === 'plumbing') {
                  aiResponse = aiResponses[1];
                } else if (detectedCategory === 'electrical') {
                  aiResponse = aiResponses[3];
                } else if (detectedCategory === 'cleaning') {
                  aiResponse = aiResponses[4];
                } else if (detectedCategory === 'handyman') {
                  aiResponse = aiResponses[5];
                } else {
                  aiResponse = aiResponses[1];
                }
                
                if (detectedCategory) {
                  setActiveCategory(detectedCategory);
                  aiResponse = { ...aiResponse, serviceCategory: detectedCategory as 'plumbing' | 'electrical' | 'cleaning' | 'handyman' };
                }

                const aiMessage: Message = {
                  id: `ai-${Date.now()}`,
                  type: 'ai',
                  content: aiResponse.content,
                  suggestions: aiResponse.suggestions,
                  serviceCategory: aiResponse.serviceCategory,
                  timestamp: new Date()
                };

                setMessages(prev => [...prev, aiMessage]);
                setConversationStep(3);
                setMessageAnimating(false);
              }, 600); // Optimized AI thinking time
            }, 400); // Brief pause after user message
          }, 800); // Time for welcome message to settle
        }
      }, 200); // Initial delay for smooth page load
      
      return () => clearTimeout(welcomeTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]); // Only depend on isReady

  // Update orb activity based on conversation
  useEffect(() => {
    if (activeCategory) {
      setFloatingOrbs(orbs => 
        orbs.map(orb => ({
          ...orb,
          opacity: orb.category === activeCategory ? 0.6 : 0.1,
          size: orb.category === activeCategory ? orb.size * 1.2 : orb.size * 0.8
        }))
      );
    }
  }, [activeCategory]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping || messageAnimating) return;

    // Instant feedback with smooth UX
    setInputValue('');
    
    // Add user message immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Optimized timing for natural conversation flow
    setTimeout(() => {
      setIsTyping(true);
    }, 150);

    // Perfect timing for natural conversation
    setTimeout(() => {
      setIsTyping(false);
      
      // Detect service category from user input
      const detectedCategory = detectServiceCategory(content);
      let aiResponse;
      let includeServiceProviders = false;
      
      if (detectedCategory && conversationStep === 1) {
        // First user message - respond based on detected category
        if (detectedCategory === 'plumbing') {
          aiResponse = aiResponses[1]; // Plumbing response
        } else if (detectedCategory === 'electrical') {
          aiResponse = aiResponses[3]; // Electrical response
        } else if (detectedCategory === 'cleaning') {
          aiResponse = aiResponses[4]; // Cleaning response
        } else if (detectedCategory === 'handyman') {
          aiResponse = aiResponses[5]; // Handyman response
        } else {
          aiResponse = aiResponses[1]; // Default to plumbing
        }
        setActiveCategory(detectedCategory);
      } else if (conversationStep >= 2) {
        // Show service providers after budget/timeline discussion
        aiResponse = {
          content: "Perfect! Based on your requirements, I've found several qualified professionals in your area. Here are the top-rated providers who can help you with your plumbing needs:",
          suggestions: []
        };
        includeServiceProviders = true;
      } else {
        // Use sequential responses for follow-up questions
        aiResponse = aiResponses[Math.min(conversationStep, aiResponses.length - 1)];
      }

      if (detectedCategory) {
        aiResponse = { ...aiResponse, serviceCategory: detectedCategory as 'plumbing' | 'electrical' | 'cleaning' | 'handyman' };
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse.content,
        suggestions: aiResponse.suggestions,
        serviceCategory: aiResponse.serviceCategory,
        serviceProviders: includeServiceProviders ? mockServiceProviders : undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationStep(prev => prev + 1);
    }, 700); // Optimized for natural feel
  };

  const detectServiceCategory = (content: string): string | null => {
    const categories = {
      plumbing: ['plumber', 'plumbing', 'faucet', 'pipe', 'drain', 'water', 'leak'],
      electrical: ['electrical', 'electrician', 'wiring', 'outlet', 'light', 'power'],
      cleaning: ['cleaning', 'clean', 'house cleaning', 'maid', 'housekeeping'],
      handyman: ['handyman', 'repair', 'fix', 'maintenance', 'general']
    };

    const lowerContent = content.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return category;
      }
    }
    return null;
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTyping && !messageAnimating) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };
  
  // Focus input after AI response for better UX
  useEffect(() => {
    if (!isTyping && !messageAnimating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping, messageAnimating]);
  
  // Handle typing bubble with delay and cleanup
  useEffect(() => {
    if (inputValue.trim() && !isTyping && !messageAnimating) {
      const timer = setTimeout(() => {
        setShowTypingBubble(true);
        setTypingText(inputValue);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShowTypingBubble(false);
      setTypingText('');
    }
  }, [inputValue, isTyping, messageAnimating]);
  
  // Initialize luxury textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.border = 'none';
    }
  }, []);

  return (
    // Use dynamic viewport height for mobile (avoids 100vh issues with browser chrome)
    <div className="min-h-[calc(var(--app-vh,1vh)*100)] bg-black relative overflow-hidden">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        
        {/* Ultra-smooth floating orbs */}
        {!isInitializing && floatingOrbs.map((orb, index) => (
          <div
            key={orb.id}
            className="absolute rounded-full blur-sm float-orb"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              backgroundColor: orb.color,
              opacity: orb.category === activeCategory ? 0.2 : orb.opacity,
              transform: `scale(${orb.category === activeCategory ? 1.2 : 1})`,
              animationDelay: `${index * 2}s`,
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="relative z-10 flex flex-col h-[calc(var(--app-vh,1vh)*100)] overflow-hidden">
        {/* Fixed Header with glassmorphic design */}
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 p-3 sm:p-4 pt-safe">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Conversational Cosmos</h1>
                <p className="text-xs sm:text-sm text-blue-300">AI Service Discovery</p>
              </div>
            </div>
            
            {/* Progress Visualization */}
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index < conversationStep 
                      ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Messages Container with Dynamic Bottom Padding - Account for fixed header and input */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pt-24 sm:pt-28 pb-56 sm:pb-60 px-3 sm:px-4 space-y-5 sm:space-y-6 scroll-smooth">
          {messages.map((message, index) => {
            // Check if this is the first user message (from dashboard)
            const isInitialUserMessage = message.type === 'user' && 
              hasInitialMessage && 
              messages.filter(m => m.type === 'user').indexOf(message) === 0;
            
            const animationClass = (() => {
              if (isInitialUserMessage) return 'animate-dashboardSlide';
              if (message.type === 'user') return 'animate-smoothPop';
              return 'animate-slideUp';
            })();
            
            return (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} ${animationClass}`}
                style={{ 
                  animationDelay: isInitialUserMessage ? '0ms' : `${Math.min(index * 80, 160)}ms`
                }}
              >
                <div className={`${message.type === 'ai' ? 'max-w-[90%] md:max-w-2xl xl:max-w-3xl' : 'max-w-[78%] md:max-w-xl'} ${message.type === 'user' ? 'ml-10 sm:ml-12' : 'mr-10 sm:mr-12'}`}>
                  {/* Avatar */}
                  <div className={`flex items-end space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/10 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600' 
                        : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500'
                    }`}>
                      {message.type === 'user' ? 
                        <User className="w-4 h-4 text-white drop-shadow-sm" /> : 
                        <div className="relative">
                          {/* Custom AI Brain Icon */}
                          <svg className="w-5 h-5 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72v-.68c0-.41-.33-.75-.75-.75-.19 0-.37.07-.5.19-.74.27-1.54.41-2.37.41-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 .83-.14 1.63-.41 2.37-.12.13-.19.31-.19.5 0 .42.34.75.75.75h.68c.32 0 .61-.19.72-.49.39-1.07.6-2.22.6-3.41C22 6.48 17.52 2 12 2z"/>
                            <circle cx="9" cy="10" r="1.5"/>
                            <circle cx="15" cy="10" r="1.5"/>
                            <path d="M12 14.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"/>
                            <path d="M8.5 12.5h7c.28 0 .5.22.5.5s-.22.5-.5.5h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"/>
                          </svg>
                          {/* Subtle pulse animation for AI */}
                          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20"></div>
                        </div>
                      }
                    </div>
                    
                    {/* Enhanced Professional Message Bubble */}
                    <div className={`relative message-bubble transition-all duration-300 ease-out hover:scale-[1.01] ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/[0.08] backdrop-blur-2xl border border-white/20 text-white shadow-xl'
                    } rounded-2xl px-4 py-3 sm:px-5 sm:py-4 ${
                      isInitialUserMessage ? 'animate-messageGlow' : ''
                    }`}>
                      {/* Enhanced glassmorphic effect for AI messages */}
                      {message.type === 'ai' && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-pink-500/8 rounded-2xl"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-2xl"></div>
                        </>
                      )}
                      
                      {/* User message glow effect */}
                      {message.type === 'user' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-sm"></div>
                      )}
                      
                      <div className="relative z-10">
                        <p className="whitespace-pre-wrap text-[14px] sm:text-[15px] leading-relaxed font-medium tracking-wide md:leading-[1.55]">{message.content}</p>
                        
                        {/* Service Provider Cards */}
                        {message.serviceProviders && message.serviceProviders.length > 0 && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                                Top Providers for You
                              </h3>
                              <span className="text-xs sm:text-sm text-blue-200 bg-blue-500/20 px-2.5 py-0.5 rounded-full">
                                {message.serviceProviders.length} found
                              </span>
                            </div>
                            
                            {/* Responsive Container - Horizontal on Desktop, Vertical on Mobile */}
                            <div className="hidden md:block overflow-x-auto pb-4">
                              {/* Desktop Horizontal Layout */}
                              <div className="flex space-x-4 w-max pr-2">
                                {message.serviceProviders.slice(0, 4).map((provider) => (
                                  <div key={provider.id} className="flex-shrink-0 w-72 xl:w-80 bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:from-white/12 hover:to-white/8 transition-all duration-300 group shadow-xl hover:shadow-2xl">
                                    {/* Header Section */}
                                    <div className="flex items-center space-x-4 mb-4">
                                      {/* Provider Image */}
                                      <div className="relative flex-shrink-0">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white/20 group-hover:ring-blue-400/50 transition-all duration-300">
                                          <img
                                            src={provider.profileImage}
                                            alt={provider.businessName}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        {provider.verified && (
                                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                          </div>
                                        )}
                                        {provider.available && (
                                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                        )}
                                      </div>
                                      
                                      {/* Provider Basic Info */}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white text-sm sm:text-base truncate mb-1">{provider.businessName}</h4>
                                        <p className="text-blue-200 text-xs sm:text-sm mb-2">{provider.category}</p>
                                        <div className="flex items-center space-x-3 text-xs">
                                          <div className="flex items-center space-x-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            <span className="text-white font-semibold">{provider.rating}</span>
                                            <span className="text-blue-200">({provider.reviewCount})</span>
                                          </div>
                                          <div className="flex items-center text-blue-200">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {provider.distance}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Stats Row */}
                                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                                      <div className="bg-white/5 rounded-lg p-2">
                                        <div className="text-green-400 font-bold text-xs sm:text-sm">{provider.priceRange}</div>
                                        <div className="text-blue-200 text-[10px] sm:text-xs">Price</div>
                                      </div>
                                      <div className="bg-white/5 rounded-lg p-2">
                                        <div className="text-blue-300 font-bold text-xs sm:text-sm flex items-center justify-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {provider.responseTime}
                                        </div>
                                        <div className="text-blue-200 text-xs">Response</div>
                                      </div>
                                      <div className="bg-white/5 rounded-lg p-2">
                                        <div className="text-purple-300 font-bold text-xs sm:text-sm">{provider.completedJobs}</div>
                                        <div className="text-blue-200 text-[10px] sm:text-xs">Jobs</div>
                                      </div>
                                    </div>
                                    
                                    {/* Tags removed for cleaner compact card */}
                                    <div className="mt-1 mb-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    
                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                      <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2">
                                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span>View Profile</span>
                                      </button>
                                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                        <button onClick={() => openWhatsAppModal(provider)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-2 px-1.5 sm:px-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center shadow-md">
                                          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-1.5 sm:px-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center">
                                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                        <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-1.5 sm:px-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center">
                                          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Mobile Vertical Layout */}
                            <div className="md:hidden space-y-4">
                              {message.serviceProviders.slice(0, 3).map((provider) => (
                                <div key={provider.id} className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:from-white/12 hover:to-white/8 transition-all duration-300 group shadow-xl">
                                  {/* Mobile Header */}
                                  <div className="flex items-start space-x-3 mb-3">
                                    {/* Provider Image */}
                                    <div className="relative flex-shrink-0">
                                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/20 group-hover:ring-blue-400/50 transition-all duration-300">
                                        <img
                                          src={provider.profileImage}
                                          alt={provider.businessName}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      {provider.verified && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      )}
                                      {provider.available && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                                      )}
                                    </div>
                                    
                                    {/* Provider Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between mb-1">
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-white text-xs truncate">{provider.businessName}</h4>
                                          <p className="text-blue-200 text-[11px]">{provider.category}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-2">
                                          <div className="flex items-center space-x-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            <span className="text-white font-semibold text-xs">{provider.rating}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Mobile Stats */}
                                      <div className="flex items-center space-x-2 text-[11px] text-blue-200 mb-2">
                                        <span className="text-green-400 font-medium">{provider.priceRange}</span>
                                        <div className="flex items-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {provider.responseTime}
                                        </div>
                                        <div className="flex items-center">
                                          <MapPin className="w-3 h-3 mr-1" />
                                          {provider.distance}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Tags removed for mobile card */}
                                  <div className="mb-2 h-px bg-white/10" />
                                  
                                  {/* Mobile Actions */}
                                  <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                                    <button className="col-span-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-medium transition-all duration-300 text-[10px] sm:text-xs flex items-center justify-center space-x-1">
                                      <ExternalLink className="w-3 h-3" />
                                      <span>View</span>
                                    </button>
                                    <button onClick={() => openWhatsAppModal(provider)} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg transition-all duration-300 flex items-center justify-center shadow">
                                      <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg transition-all duration-300 flex items-center justify-center">
                                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Professional Load More Button */}
                            <div className="mt-6 text-center">
                              <button 
                                onClick={() => navigate('/providers', { 
                                  state: { 
                                    providers: message.serviceProviders,
                                    searchQuery: 'Top matched providers',
                                    category: message.serviceCategory || 'Plumbing'
                                  }
                                })}
                                className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 px-5 sm:py-3 sm:px-6 md:px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base"
                              >
                                <span>Explore {message.serviceProviders.length}</span>
                                <div className="w-4 h-4 md:w-5 md:h-5 bg-white/20 rounded-full flex items-center justify-center">
                                  <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Suggestion Chips */}
                        {message.suggestions && !message.serviceProviders && (
                          <div className="mt-5 flex flex-wrap gap-2.5">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-2 sm:px-4 sm:py-2.5 bg-white/8 backdrop-blur-sm border border-white/15 rounded-lg text-blue-200 hover:bg-white/15 hover:border-blue-400/40 hover:text-white transition-all duration-300 text-[12px] sm:text-[13px] font-medium shadow-md hover:shadow-blue-500/10 flex items-center gap-2 group"
                              >
                                <span className="whitespace-nowrap group-hover:translate-x-0.5 transition-transform duration-300">{suggestion}</span>
                                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced timestamp */}
                      <div className={`text-xs mt-3 flex items-center space-x-2 ${
                        message.type === 'user' ? 'text-blue-200/70' : 'text-white/40'
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        <span className="font-medium">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.type === 'ai' && (
                          <span className="text-white/30">• AI Response</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Professional Typing Indicator */}
          {(isTyping || messageAnimating) && (
            <div className="flex justify-start animate-fadeInSmooth">
              <div className="max-w-xs lg:max-w-md mr-12">
                <div className="flex items-end space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-white/10">
                    <div className="relative">
                      {/* Custom AI Brain Icon */}
                      <svg className="w-5 h-5 text-white drop-shadow-sm animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72v-.68c0-.41-.33-.75-.75-.75-.19 0-.37.07-.5.19-.74.27-1.54.41-2.37.41-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 .83-.14 1.63-.41 2.37-.12.13-.19.31-.19.5 0 .42.34.75.75.75h.68c.32 0 .61-.19.72-.49.39-1.07.6-2.22.6-3.41C22 6.48 17.52 2 12 2z"/>
                        <circle cx="9" cy="10" r="1.5"/>
                        <circle cx="15" cy="10" r="1.5"/>
                        <path d="M12 14.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"/>
                        <path d="M8.5 12.5h7c.28 0 .5.22.5.5s-.22.5-.5.5h-7c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"/>
                      </svg>
                      {/* Enhanced thinking animation */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-spin"></div>
                    </div>
                  </div>
                  <div className="message-bubble bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-2xl px-5 py-4 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-pink-500/8 rounded-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                          <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <span className="text-sm text-blue-300/80 font-medium">
                          {messageAnimating ? 'Analyzing your request...' : 'AI is thinking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* User Typing Bubble */}
          {showTypingBubble && (
            <div className="flex justify-end animate-fadeInSmooth">
              <div className="max-w-xs lg:max-w-md ml-12">
                <div className="flex items-end space-x-3 flex-row-reverse space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-blue-600/70 to-purple-600/70 backdrop-blur-xl border border-blue-400/30 rounded-2xl px-4 py-3 text-white">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm opacity-80">{typingText.substring(0, 30)}{typingText.length > 30 ? '...' : ''}</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>

        {/* Fixed Luxury Premium Input Area */}
        <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
          {/* Luxury gradient background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-gray-900/40 to-transparent"></div>
          
          {/* Glassmorphic container */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-r from-white/8 via-white/5 to-white/8 border-t border-white/20 p-2.5 sm:p-3 md:p-4">
            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              {/* Main input container */}
              <div className="flex items-end space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3">
                {/* Luxury text input with sophisticated styling */}
                <div className="flex-1 relative group">
                  {/* Input background with multiple layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 p-[1px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500">
                    <div className="w-full h-full bg-gray-900/80 rounded-2xl"></div>
                  </div>
                  
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isTyping ? "✨ AI is crafting a response..." : "✨ Share your service needs..."}
                    disabled={isTyping || messageAnimating}
                    rows={1}
                    spellCheck={false}
                    autoComplete="off"
                    className="relative w-full px-4 py-2.5 pr-10 sm:px-5 sm:py-3 sm:pr-12 bg-transparent text-white placeholder-blue-300/70 resize-none min-h-[48px] sm:min-h-[52px] max-h-32 border-0 outline-none transition-all duration-300 ease-out text-[14px] sm:text-[15px] leading-relaxed z-10 overflow-hidden"
                    style={{ 
                      height: '48px',
                      minHeight: '48px',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = '48px';
                      const newHeight = Math.min(target.scrollHeight, 128);
                      target.style.height = `${newHeight}px`;
                    }}
                    onBlur={() => {
                      if (inputRef.current) {
                        inputRef.current.style.height = '48px';
                      }
                    }}
                  />
                  
                  {/* Luxury microphone button */}
                  <button className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gradient-to-r from-gray-700/80 to-gray-600/80 backdrop-blur-sm border border-white/15 rounded-lg flex items-center justify-center text-white/90 hover:text-white hover:from-blue-600/70 hover:to-purple-600/70 hover:border-blue-400/40 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-blue-500/20">
                    <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  
                  {/* Typing indicator */}
                  {inputValue && (
                    <div className="absolute bottom-1.5 sm:bottom-2 left-4 sm:left-6 text-[10px] sm:text-xs text-blue-300/60">
                      {inputValue.length} chars
                    </div>
                  )}
                </div>
                
                {/* Ultra-premium send button */}
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping || messageAnimating}
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white transition-all duration-300 ease-out shadow-xl group ${
                    (!inputValue.trim() || isTyping || messageAnimating) 
                      ? 'bg-gray-700/50 opacity-40 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
                  }`}
                >
                  {/* Button glow effect */}
                  {inputValue.trim() && !isTyping && !messageAnimating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                  )}
                  
                  {/* Button content */}
                  <div className="relative z-10">
                    {(isTyping || messageAnimating) ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  
                  {/* Shimmer effect */}
                  {inputValue.trim() && !isTyping && !messageAnimating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 rounded-2xl"></div>
                  )}
                </button>
              </div>
              
              {/* Luxury quick suggestions */}
              <div className="space-y-1.5 sm:space-y-2 relative">
                <div className="text-[10px] sm:text-xs text-gray-400/70 font-medium tracking-wide uppercase pl-1">Quick Actions</div>
                <div className="relative">
                  {/* Mobile: Grid layout, Desktop: Horizontal scroll */}
                  <div className="block sm:hidden">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { text: '🚨 Emergency', fullText: '🚨 Emergency repair', color: 'from-red-500/20 to-orange-500/20', border: 'red-400/30' },
                        { text: '💰 Quote', fullText: '💰 Budget quote', color: 'from-green-500/20 to-emerald-500/20', border: 'green-400/30' },
                        { text: '📅 Schedule', fullText: '📅 Schedule appointment', color: 'from-blue-500/20 to-cyan-500/20', border: 'blue-400/30' },
                        { text: '⭐ Reviews', fullText: '⭐ View reviews', color: 'from-purple-500/20 to-pink-500/20', border: 'purple-400/30' }
                      ].map((suggestion, index) => (
                        <button
                          key={suggestion.text}
                          onClick={() => handleSendMessage(suggestion.fullText)}
                          disabled={isTyping || messageAnimating}
                          className={`relative px-2 py-1.5 bg-gradient-to-r ${suggestion.color} backdrop-blur-sm border border-${suggestion.border} rounded-lg text-[10px] font-medium transition-all duration-300 ease-out animate-fadeInSmooth overflow-hidden group ${
                            (isTyping || messageAnimating)
                              ? 'text-gray-500/60 cursor-not-allowed opacity-40'
                              : 'text-white/90 hover:text-white hover:scale-105 hover:shadow-lg active:scale-95'
                          }`}
                          style={{ animationDelay: `${index * 100 + 400}ms` }}
                        >
                          {/* Button highlight effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                          <span className="relative z-10">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Desktop: Horizontal scroll layout */}
                  <div className="hidden sm:block">
                    {/* Gradient edge masks */}
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/60 to-transparent rounded-l-xl z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[#0b0f17] via-[#0b0f17]/60 to-transparent rounded-r-xl z-10" />
                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar pr-4 -ml-1 pl-1 snap-x snap-mandatory">
                      {[
                        { text: '🚨 Emergency repair', color: 'from-red-500/20 to-orange-500/20', border: 'red-400/30' },
                        { text: '💰 Budget quote', color: 'from-green-500/20 to-emerald-500/20', border: 'green-400/30' },
                        { text: '📅 Schedule appointment', color: 'from-blue-500/20 to-cyan-500/20', border: 'blue-400/30' },
                        { text: '⭐ View reviews', color: 'from-purple-500/20 to-pink-500/20', border: 'purple-400/30' }
                      ].map((suggestion, index) => (
                        <button
                          key={suggestion.text}
                          onClick={() => handleSendMessage(suggestion.text)}
                          disabled={isTyping || messageAnimating}
                          className={`snap-start relative px-3.5 py-2 bg-gradient-to-r ${suggestion.color} backdrop-blur-sm border border-${suggestion.border} rounded-lg text-[12px] font-medium transition-all duration-300 ease-out animate-fadeInSmooth overflow-hidden group whitespace-nowrap min-w-0 flex-shrink-0 ${
                            (isTyping || messageAnimating)
                              ? 'text-gray-500/60 cursor-not-allowed opacity-40'
                              : 'text-white/90 hover:text-white hover:scale-105 hover:shadow-lg active:scale-95'
                          }`}
                          style={{ animationDelay: `${index * 100 + 400}ms` }}
                        >
                          {/* Button highlight effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                          <span className="relative z-10">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="flex items-center justify-between mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] text-gray-400/60">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isTyping || messageAnimating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                  }`}></div>
                  <span>{isTyping || messageAnimating ? 'AI is processing...' : 'Ready to help'}</span>
                </div>
                <div className="text-gray-500/40">
                  Powered by ServiceGPT AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {waOpen && waProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setWaOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-gradient-to-br from-[#101826]/90 via-[#0d1320]/85 to-[#161b2b]/90 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 15% 20%, rgba(59,130,246,.25) 0, transparent 55%), radial-gradient(circle at 85% 30%, rgba(147,51,234,.25) 0, transparent 60%), radial-gradient(circle at 60% 85%, rgba(236,72,153,.25) 0, transparent 60%)'}} />
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.07)_100%)]" />
            <div className="relative p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-white via-blue-50 to-purple-200 bg-clip-text text-transparent">Message {waProvider.businessName}</h2>
                  <p className="text-[11px] text-blue-200/70 mt-1 uppercase tracking-wider">WhatsApp Outreach Preview</p>
                </div>
                <button onClick={() => setWaOpen(false)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/10">
                  <img src={waProvider.profileImage} alt={waProvider.businessName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{waProvider.businessName}</p>
                  <p className="text-[11px] text-blue-300/70 uppercase tracking-wider">{waProvider.category}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-blue-200/60">
                    <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />{waProvider.rating.toFixed(1)}</span>
                    <span>{waProvider.distance}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300/90 font-medium">{waProvider.priceRange}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-blue-200/70 block mb-2">Prefilled Message</label>
                <div className="relative group">
                  <textarea value={waPrefill} onChange={e=>setWaPrefill(e.target.value)} rows={5} className="w-full rounded-2xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none p-4 text-sm text-blue-50/90 leading-relaxed backdrop-blur-md transition-all" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-focus-within:ring-blue-400/40 transition" />
                </div>
                <div className="flex justify-between mt-2 text-[11px] text-blue-300/50">
                  <span>{waPrefill.length} chars</span>
                  <span>Editable</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 flex gap-2 sm:gap-3">
                  <button disabled={waSending || waSent} onClick={simulateWaPrepare} className={`flex-1 h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all relative overflow-hidden ${waSent ? 'bg-green-600/20 border border-green-400/40 text-green-300' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white border border-green-400/30 shadow-lg hover:shadow-green-500/30'} ${waSending ? 'opacity-70 cursor-wait' : ''}`}>
                    {waSending && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
                    {waSent && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    {!waSending && !waSent && <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    <span>{waSent ? 'Prepared' : waSending ? 'Preparing...' : 'Prepare & Track'}</span>
                  </button>
                  <a onClick={e=>{if(!waSent){e.preventDefault(); simulateWaPrepare();}}} href={buildWaLink()} target="_blank" rel="noopener noreferrer" className={`flex-1 h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${waSent ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg' : 'bg-white/5 text-blue-200/70 border border-white/10 hover:bg-white/10'} `}>
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{waSent ? 'Open WhatsApp' : 'Open (after prep)'}</span>
                  </a>
                </div>
              </div>
              <div className="relative mt-1 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 transition-all duration-700 ${waSending ? 'w-2/3 animate-pulse' : waSent ? 'w-full' : 'w-0'}`} />
                {waSent && <div className="absolute inset-0 rounded-full ring-1 ring-green-400/40 animate-pulse" />}
              </div>
              {waSent && (
                <p className="text-[11px] text-green-300/80 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Message prepared locally (mock).</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
