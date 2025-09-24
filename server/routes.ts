import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateTokenPair, 
  verifyRefreshToken, 
  jwtAuthenticated, 
  flexibleAuth, 
  getAuthenticatedUser,
  requireRole,
  type JWTPayload 
} from "./jwtAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - Integration: javascript_log_in_with_replit
  await setupAuth(app);

  // JWT Authentication Routes
  
  // Generate JWT tokens (for authenticated users)
  app.post('/api/auth/jwt/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user._id.toString(),
        email: user.email,
        userType: user.userType as 'client' | 'lawyer' | 'admin',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      };

      const tokens = generateTokenPair(tokenPayload);
      
      res.json({
        message: "JWT tokens generated successfully",
        ...tokens,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
        }
      });
    } catch (error) {
      console.error("Error generating JWT tokens:", error);
      res.status(500).json({ message: "Failed to generate tokens" });
    }
  });

  // Refresh JWT tokens
  app.post('/api/auth/jwt/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ 
          message: "Refresh token required",
          code: "NO_REFRESH_TOKEN"
        });
      }

      const payload = verifyRefreshToken(refreshToken);
      
      // Verify user still exists
      const user = await storage.getUser(payload.userId);
      if (!user) {
        return res.status(401).json({ 
          message: "User not found",
          code: "USER_NOT_FOUND"
        });
      }

      const newTokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user._id.toString(),
        email: user.email,
        userType: user.userType as 'client' | 'lawyer' | 'admin',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      };

      const tokens = generateTokenPair(newTokenPayload);
      
      res.json({
        message: "Tokens refreshed successfully",
        ...tokens
      });
    } catch (error) {
      console.error("Error refreshing JWT tokens:", error);
      res.status(401).json({ 
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN"
      });
    }
  });

  // Validate JWT token
  app.get('/api/auth/jwt/validate', jwtAuthenticated, async (req: any, res) => {
    try {
      res.json({
        message: "Token is valid",
        user: {
          id: req.jwtUser.user._id,
          email: req.jwtUser.user.email,
          firstName: req.jwtUser.user.firstName,
          lastName: req.jwtUser.user.lastName,
          userType: req.jwtUser.user.userType
        },
        tokenInfo: {
          userId: req.jwtUser.userId,
          userType: req.jwtUser.userType,
          iat: req.jwtUser.iat,
          exp: req.jwtUser.exp
        }
      });
    } catch (error) {
      console.error("Error validating JWT token:", error);
      res.status(500).json({ message: "Token validation failed" });
    }
  });

  // Auth routes (with flexible authentication)
  app.get('/api/auth/user', flexibleAuth, async (req: any, res) => {
    try {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUser(authUser.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile update
  app.put('/api/auth/user', flexibleAuth, async (req: any, res) => {
    try {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const updates = req.body;
      
      const user = await storage.updateUser(authUser.userId, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get lawyers (public endpoint)
  app.get('/api/lawyers', async (req, res) => {
    try {
      const filters = req.query;
      const lawyers = await storage.searchLawyers(filters as any);
      res.json(lawyers);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      res.status(500).json({ message: "Failed to fetch lawyers" });
    }
  });

  // Cases management (protected)
  app.get('/api/cases', flexibleAuth, async (req: any, res) => {
    try {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUser(authUser.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let cases;
      if (user.userType === 'lawyer') {
        cases = await storage.getCasesByLawyer(authUser.userId);
      } else {
        cases = await storage.getCasesByClient(authUser.userId);
      }
      
      res.json(cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  // Create case (protected - clients only)
  app.post('/api/cases', flexibleAuth, requireRole('client'), async (req: any, res) => {
    try {
      const authUser = getAuthenticatedUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const caseData = {
        ...req.body,
        clientId: authUser.userId,
      };

      const newCase = await storage.createCase(caseData);
      res.status(201).json(newCase);
    } catch (error) {
      console.error("Error creating case:", error);
      res.status(500).json({ message: "Failed to create case" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
