<script>


</script>

<div class="welcome-banner-container">
    <img src="/public/banner.jpeg" alt="Welcome to PantryPeeker!" class="welcome-banner-image">
    <div class="welcome-text">
        <p class="main-text">Welcome to</p>
        <p class="main-text">PantryPeeker!</p>
        <p class="subtext">See what items we currently have in stock down below!</p>
    </div>
</div>

<style>
    .welcome-banner-container {
        position: relative;
        width: 100%;
        max-height: 420px;
        border-bottom: #333 4px solid;
        .welcome-banner-image {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0.5;
            object-fit: cover;
            width: 100%;
            height: 100%;
            filter: brightness(0.6) blur(3px);
        }
        .welcome-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #333;
            opacity: 1;
            position: relative;
            
            .main-text {
                font-size: 5.5rem;
                font-weight: bold;
                padding: 0;
                margin: 0;
            }
            .subtext {
                font-size: 1.8rem;
                font-weight: normal;
            }
        }
    }
</style>