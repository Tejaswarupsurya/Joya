module.exports = (username, verificationUrl) => `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <!-- Import Google Font -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
  </style>
  
  <div style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <!-- Elegant Joya Text - Matching the brand style -->
    <h1 style="color: white; margin: 0; font-family: 'Dancing Script', cursive; font-weight: 600; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Joya</h1>
    <p style="color: white; margin: 10px 0 0 0; font-weight: 500;">Email Verification</p>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 600;">Welcome to Joya, ${username}!</h2>
    
    <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      Thank you for signing up! Please verify your email address to access all features of Joya.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        Verify Email Address
      </a>
    </div>
    
    <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="color: #fc5c79; word-break: break-all; font-size: 14px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      ${verificationUrl}
    </p>
    
    <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px;">
      This verification link will expire in 24 hours. If you didn't create an account with Joya, please ignore this email.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px; margin: 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        This is an automated email from Joya Platform. Please do not reply to this email.
      </p>
    </div>
  </div>
</div>
`;
