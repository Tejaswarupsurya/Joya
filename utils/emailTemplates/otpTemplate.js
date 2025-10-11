module.exports = (username, otp) => `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <!-- Import Google Font -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
  </style>
  
  <div style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <!-- Elegant Joya Text - Matching the brand style -->
    <h1 style="color: white; margin: 0; font-family: 'Dancing Script', cursive; font-weight: 600; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Joya</h1>
    <p style="color: white; margin: 10px 0 0 0; font-weight: 500; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Password Reset Request</p>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 600;">Hello ${username}!</h2>
    
    <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      You requested a password reset for your Joya account. Use the OTP below to reset your password:
    </p>
    
    <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border-left: 4px solid #fc5c79;">
      <h1 style="color: #fc5c79; font-size: 36px; margin: 0; letter-spacing: 3px;">${otp}</h1>
      <p style="color: #999; margin: 10px 0 0 0; font-size: 14px;">This OTP is valid for 10 minutes</p>
    </div>
    
    <p style="color: #666; line-height: 1.6;">
      If you didn't request this password reset, please ignore this email or contact our support team.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px; margin: 0;">
        This is an automated email from Joya Platform. Please do not reply to this email.
      </p>
    </div>
  </div>
</div>
`;
